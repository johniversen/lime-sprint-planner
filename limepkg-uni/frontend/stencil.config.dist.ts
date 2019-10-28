import { Config } from '@stencil/core';
import { OutputTargetDist } from '@stencil/core/dist/declarations/output-targets';
import { sass } from '@stencil/sass';

const targetDist: OutputTargetDist = {
    type: 'dist',
    copy: [{ src: '../lwc.config.json' }],
};

export const config: Config = {
    namespace: 'limepkg-uni-lwc-components',
    outputTargets: [targetDist],
    plugins: [sass()],
    testing: {
        browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    excludeSrc: ['**/test/**', '**/dev-assets/**', '**/*.spec.*', '**/*.e2e.*'],
};