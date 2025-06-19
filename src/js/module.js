module.exports = {
    theme: {
      extend: {
        animation: {
          float1: 'float1 8s ease-in-out infinite',
          float2: 'float2 10s ease-in-out infinite',
          float3: 'float3 12s ease-in-out infinite',
        },
        keyframes: {
          float1: {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: 'translateY(-20px) translateX(10px)' },
          },
          float2: {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: 'translateY(15px) translateX(-15px)' },
          },
          float3: {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: 'translateY(-10px) translateX(20px)' },
          }
        }
      }
    }
  }