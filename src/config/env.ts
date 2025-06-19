interface Env {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_ENV: 'development' | 'production';
}

export const env: Env = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_ENV: (process.env.NEXT_PUBLIC_ENV as 'development' | 'production') || 'development',
};
