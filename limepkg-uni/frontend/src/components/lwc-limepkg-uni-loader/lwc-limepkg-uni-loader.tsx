import {
    LimePluginLoader,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
} from '@limetech/lime-web-components-interfaces';
import { Component, Prop } from '@stencil/core';

// NOTE: Do NOT remove this component, it is required to run the plugin correctly.
// However, if your plugin has any code that should run only once when the application
// starts, you are free to use the component lifecycle methods below to do so.
// The component should never render anything, so do NOT implement a render method.

@Component({
    tag: 'lwc-limepkg-uni-loader',
    shadow: true,
})
export class Loader implements LimePluginLoader {
    @Prop()
    public platform: LimeWebComponentPlatform;

    @Prop()
    public context: LimeWebComponentContext;

    public componentWillLoad() {
        // tslint:disable-line:no-empty
    }

    public componentDidUnload() {
        // tslint:disable-line:no-empty
    }
}
