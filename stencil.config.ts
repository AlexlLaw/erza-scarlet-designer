import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { inlineSvg } from 'stencil-inline-svg';

export const config: Config = {
  namespace: 'erza-scarlet-designer',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  globalStyle: 'src/assets/tokens/tokens.scss',
  plugins: [
    inlineSvg(),
    sass({
      injectGlobalPaths: ['src/assets/tokens/tokens.scss'],
    }),
  ],
};
