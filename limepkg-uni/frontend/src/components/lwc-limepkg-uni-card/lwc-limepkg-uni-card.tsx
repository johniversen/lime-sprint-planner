import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    NotificationService,
    PlatformServiceName,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop } from '@stencil/core';

@Component({
    tag: 'lwc-limepkg-uni-card',
    shadow: true,
    styleUrl: 'lwc-limepkg-uni-card.scss',
})
export class Card implements LimeWebComponent {
    @Prop()
    public platform: LimeWebComponentPlatform;

    @Prop()
    public context: LimeWebComponentContext;

    @Element()
    public element: HTMLElement;

    public render() {
        return (
            <limel-button
                label={`Hello World!`}
                outlined={true}
                icon={'house_stark'}
                onClick={() => {
                    const notifications: NotificationService = this.platform.get(
                        PlatformServiceName.Notification
                    );
                    notifications.notify(`Winter is coming`);
                }}
            />
        );
    }
}
