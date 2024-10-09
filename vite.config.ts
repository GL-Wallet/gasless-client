import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import generateFile from 'vite-plugin-generate-file';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import tsconfigPaths from 'vite-tsconfig-paths';

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react-swc';

import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    build: {
      outDir: 'dist'
    },

    plugins: [
      // Allows using React dev server along with building a React application with Vite.
      // https://npmjs.com/package/@vitejs/plugin-react-swc
      react(),
      // Allows using the compilerOptions.paths property in tsconfig.json.
      // https://www.npmjs.com/package/vite-tsconfig-paths
      tsconfigPaths(),
      // Allows using self-signed certificates to run the dev server using HTTPS.
      // https://www.npmjs.com/package/@vitejs/plugin-basic-ssl
      basicSsl(),

      generateFile([
        {
          type: 'json',
          output: './manifest.json',
          data: {
            version
          }
        }
      ]),

      ViteImageOptimizer({
        test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,

        include: undefined,
        exclude: undefined,

        includePublic: true,

        logStats: true,

        ansiColors: true,

        svg: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  cleanupNumericValues: false,
                  removeViewBox: false
                }
              }
            },
            'sortAttrs',
            {
              name: 'addAttributesToSVGElement',
              params: {
                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }]
              }
            }
          ]
        },

        png: {
          quality: 85 // Moderate quality to balance size and quality
        },

        jpeg: {
          quality: 85 // Moderate quality for reduced size
        },

        tiff: {
          quality: 85 // Moderate quality to reduce size
        },

        gif: {},

        webp: {
          lossless: true // Use lossless compression for quality
        },

        avif: {
          lossless: true // Use lossless compression for quality
        },

        cache: true,
        cacheLocation: './node_modules/.cache/vite-plugin-image-optimizer'
      })
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        buffer: 'buffer'
      }
    },

    publicDir: './public',

    server: {
      host: true,
      port: 5173,
      strictPort: true,
      hmr: {
        port: 5173
      }
    }
  };
});
