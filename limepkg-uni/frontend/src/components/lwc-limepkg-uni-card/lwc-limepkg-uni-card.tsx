import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
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

    @Prop()
    public header: string;

    @Prop()
    public subTitle: string;

    @Prop()
    public id: number;

    @Prop()
    public clickHandler: Function;

    @Element()
    public element: HTMLElement;




    private async handleClick() {
        console.log("HandleClick " + `${this.id}`);
        let event = new CustomEvent("onClick", {
            detail: {
                title: this.header,
                subTitle: this.subTitle,
                value: this.id
            }
        });
        this.clickHandler(event);
    }

    public render() {

        return (
            <div class="card" id={`${this.id}`} onClick={this.handleClick.bind(this)}>
                <h1 >{this.header}</h1>
                <h3 >{this.subTitle}</h3>
            </div>




        );
    }
}
