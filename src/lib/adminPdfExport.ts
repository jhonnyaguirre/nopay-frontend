import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type PdfTipoCaso = "MULTA" | "MARCA" | "PERMISO_SALIDA" | string;

const COLORS = {
  dark: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  rose: "#EC4899",
  amber: "#F59E0B",
  red: "#7F1D1D",
};

export async function exportarExpedientePDF({
  detalle,
  tipo,
  id,
}: {
  detalle: any;
  tipo: PdfTipoCaso;
  id: number;
}) {
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let y = 18;

  const addWatermark = () => {
    pdf.setTextColor(245, 245, 245);
    pdf.setFontSize(54);
    pdf.setFont("helvetica", "bold");
    pdf.text("NoPay", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 35,
    });
  };

  const addFooter = () => {
    const page = pdf.getCurrentPageInfo().pageNumber;
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Expediente generado por NoPay · Página ${page}`, 14, 290);
    pdf.text(new Date().toLocaleString("es-EC"), pageWidth - 14, 290, {
      align: "right",
    });
  };

  const newPage = () => {
    addFooter();
    pdf.addPage();
    addWatermark();
    y = 18;
  };

  const ensureSpace = (height = 30) => {
    if (y + height > 278) {
      newPage();
    }
  };

  const title = getTitulo(detalle, tipo, id);

  addWatermark();

  // Portada
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, 58, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("Expediente Legal Digital", 14, 24);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("NoPay · Centro de Operaciones Legales", 14, 34);

  pdf.setFillColor(236, 72, 153);
  pdf.roundedRect(14, 43, 55, 9, 3, 3, "F");
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text(getTipoLabel(tipo), 41.5, 49, { align: "center" });

  y = 76;

  pdf.setTextColor(COLORS.dark);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, 14, y);
  y += 12;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(COLORS.muted);
  pdf.text(
    "Documento administrativo generado para revisión, seguimiento y gestión interna del caso.",
    14,
    y
  );
  y += 12;

  addSectionTitle(pdf, "Resumen ejecutivo", y);
  y += 7;

  autoTable(pdf, {
    startY: y,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    body: [
      ["Código", safe(detalle.codigo_tramite)],
      ["Tipo", getTipoLabel(tipo)],
      ["Estado trámite", safe(detalle.estado_tramite)],
      ["Estado pago", safe(detalle.estado_pago)],
      ["Fecha creación", safe(detalle.fechacrea || detalle.fecha_registro)],
    ],
    columns: [
      { header: "Campo", dataKey: "campo" },
      { header: "Valor", dataKey: "valor" },
    ],
  } as any);

  y = (pdf as any).lastAutoTable.finalY + 12;

  // Cliente
  ensureSpace(45);
  addSectionTitle(pdf, "Datos del cliente", y);
  y += 7;

  const cliente = detalle.cliente || {};
  autoTable(pdf, {
    startY: y,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [127, 29, 29] },
    body: [
      ["Nombres", safe(cliente.nombres)],
      ["Apellidos", safe(cliente.apellidos)],
      ["Cédula", safe(cliente.cedula)],
      ["Email", safe(cliente.email)],
      ["Teléfono", safe(cliente.telefono)],
      ["WhatsApp", buildWhatsapp(cliente.telefono)],
    ],
    columns: [
      { header: "Campo", dataKey: "campo" },
      { header: "Valor", dataKey: "valor" },
    ],
  } as any);

  y = (pdf as any).lastAutoTable.finalY + 12;

  // Datos principales
  ensureSpace(50);
  addSectionTitle(pdf, "Datos principales del caso", y);
  y += 7;

  const mainRows = objectToRows(detalle, [
    "cliente",
    "vehiculo",
    "documentos",
    "clases",
    "titulares",
    "contactos",
    "historial",
    "intervinientes",
  ]);

  autoTable(pdf, {
    startY: y,
    theme: "striped",
    styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
    headStyles: { fillColor: [15, 23, 42] },
    columnStyles: {
      campo: { cellWidth: 58, fontStyle: "bold" },
      valor: { cellWidth: 120 },
    },
    body: mainRows,
    columns: [
      { header: "Campo", dataKey: "campo" },
      { header: "Valor", dataKey: "valor" },
    ],
  } as any);

  y = (pdf as any).lastAutoTable.finalY + 12;

  // Secciones específicas
  if (detalle.vehiculo) {
    y = addObjectSection(pdf, "Vehículo", detalle.vehiculo, y, newPage);
  }

  y = addArraySection(pdf, "Intervinientes", detalle.intervinientes, y, newPage);
  y = addArraySection(pdf, "Titulares", detalle.titulares, y, newPage);
  y = addArraySection(pdf, "Contactos", detalle.contactos, y, newPage);
  y = addArraySection(pdf, "Clases", detalle.clases, y, newPage);
  y = addArraySection(pdf, "Historial", detalle.historial, y, newPage);

  // Documentos con imágenes
  await addDocumentsSection(pdf, detalle, tipo, y, newPage);

  addFooter();

  pdf.save(`expediente_nopay_${String(tipo).toLowerCase()}_${id}.pdf`);
}

function addSectionTitle(pdf: jsPDF, text: string, y: number) {
  pdf.setTextColor(COLORS.dark);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text(text, 14, y);
  pdf.setDrawColor(236, 72, 153);
  pdf.line(14, y + 2, 196, y + 2);
}

function addObjectSection(
  pdf: jsPDF,
  title: string,
  obj: any,
  y: number,
  newPage: () => void
) {
  if (!obj || typeof obj !== "object") return y;

  if (y + 40 > 278) {
    newPage();
    y = 18;
  }

  addSectionTitle(pdf, title, y);
  y += 7;

  autoTable(pdf, {
    startY: y,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
    headStyles: { fillColor: [15, 23, 42] },
    body: objectToRows(obj),
    columns: [
      { header: "Campo", dataKey: "campo" },
      { header: "Valor", dataKey: "valor" },
    ],
  } as any);

  return (pdf as any).lastAutoTable.finalY + 12;
}

function addArraySection(
  pdf: jsPDF,
  title: string,
  arr: any[],
  y: number,
  newPage: () => void
) {
  if (!Array.isArray(arr) || arr.length === 0) return y;

  if (y + 45 > 278) {
    newPage();
    y = 18;
  }

  addSectionTitle(pdf, title, y);
  y += 7;

  arr.forEach((item, index) => {
    if (y + 45 > 278) {
      newPage();
      y = 18;
    }

    pdf.setFontSize(10);
    pdf.setTextColor(COLORS.rose);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${title} ${index + 1}`, 14, y);
    y += 5;

    autoTable(pdf, {
      startY: y,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2.3, overflow: "linebreak" },
      headStyles: { fillColor: [15, 23, 42] },
      body: objectToRows(item),
      columns: [
        { header: "Campo", dataKey: "campo" },
        { header: "Valor", dataKey: "valor" },
      ],
    } as any);

    y = (pdf as any).lastAutoTable.finalY + 8;
  });

  return y;
}

async function addDocumentsSection(
  pdf: jsPDF,
  detalle: any,
  tipo: string,
  startY: number,
  newPage: () => void
) {
  let y = startY;
  const documentos = detalle.documentos || [];

  if (!Array.isArray(documentos) || documentos.length === 0) return y;

  if (y + 55 > 278) {
    newPage();
    y = 18;
  }

  addSectionTitle(pdf, "Documentos e imágenes", y);
  y += 9;

  for (let i = 0; i < documentos.length; i++) {
    const doc = documentos[i];
    const url = buildDocumentoUrl(doc, tipo);
    const isImage = String(doc.mime_type || "").startsWith("image/");

    if (y + 85 > 278) {
      newPage();
      y = 18;
    }

    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(14, y, 182, 72, 4, 4, "F");

    pdf.setTextColor(COLORS.dark);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(doc.nombre_original || doc.nombre_archivo || `Documento ${i + 1}`, 18, y + 8);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.muted);

    const metaLines = [
      `Tipo: ${safe(doc.tipo_documento)}`,
      `MIME: ${safe(doc.mime_type)}`,
      `Agencia: ${safe(doc.agencia)}`,
      `Observación: ${safe(doc.observaciones || doc.observacion)}`,
      `Ruta: ${safe(doc.ruta_archivo)}`,
    ];

    let metaY = y + 16;
    metaLines.forEach((line) => {
      const split = pdf.splitTextToSize(line, 92);
      pdf.text(split, 18, metaY);
      metaY += split.length * 4;
    });

    if (url && isImage) {
      try {
        const base64 = await imageUrlToBase64(url);
        if (base64) {
          pdf.addImage(base64, "JPEG", 122, y + 8, 62, 54, undefined, "FAST");
        }
      } catch {
        pdf.setTextColor(180, 50, 50);
        pdf.text("No se pudo cargar la vista previa de imagen.", 122, y + 28);
      }
    } else {
      pdf.setTextColor(COLORS.muted);
      pdf.text("Documento sin vista previa de imagen.", 122, y + 28);
    }

    y += 80;
  }

  return y;
}

function objectToRows(obj: any, exclude: string[] = []) {
  const excluded = new Set(exclude);

  return Object.entries(obj || {})
    .filter(([key]) => !excluded.has(key))
    .map(([key, value]) => ({
      campo: humanize(key),
      valor: stringify(value),
    }));
}

function stringify(value: any) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (Array.isArray(value)) return `${value.length} registro(s)`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function safe(value: any) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function humanize(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getTipoLabel(tipo: string) {
  const t = String(tipo || "").toUpperCase();

  if (t.includes("MULTA")) return "IMPUGNACIÓN DE MULTA";
  if (t.includes("MARCA")) return "REGISTRO DE MARCA";
  if (t.includes("PERMISO")) return "PERMISO DE SALIDA";
  return t || "CASO LEGAL";
}

function getTitulo(detalle: any, tipo: string, id: number) {
  const t = String(tipo || "").toUpperCase();

  if (t.includes("MULTA")) {
    return `Multa ${detalle?.vehiculo?.placa || detalle?.codigo_tramite || id}`;
  }

  if (t.includes("MARCA")) {
    return `Marca ${detalle?.nombre_marca || detalle?.codigo_tramite || id}`;
  }

  return `Permiso de salida ${detalle?.codigo_tramite || id}`;
}

function buildWhatsapp(telefono: string) {
  const raw = String(telefono || "").replace(/\D/g, "");

  if (!raw) return "—";
  if (raw.startsWith("593")) return `https://wa.me/${raw}`;
  if (raw.startsWith("0")) return `https://wa.me/593${raw.substring(1)}`;
  if (raw.length === 9) return `https://wa.me/593${raw}`;

  return `https://wa.me/${raw}`;
}

function buildDocumentoUrl(doc: any, tipo: string) {
  const ruta = String(doc?.ruta_archivo || "");

  if (!ruta) return "";
  if (ruta.startsWith("http")) return ruta;

  if (String(tipo).toUpperCase().includes("MULTA")) {
    const filename = ruta.split("/").pop();
    return filename ? `${API_BASE}/regmultas/download/${filename}` : "";
  }

  return "";
}

async function imageUrlToBase64(url: string): Promise<string | null> {
  const response = await fetch(url);

  if (!response.ok) return null;

  const blob = await response.blob();

  return await new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => resolve(null);

    reader.readAsDataURL(blob);
  });
}