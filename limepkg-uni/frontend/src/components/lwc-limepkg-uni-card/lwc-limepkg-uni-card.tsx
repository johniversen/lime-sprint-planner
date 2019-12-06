import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, Event, EventEmitter } from '@stencil/core';

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
    public postId: number;

    @Prop()
    public priority: string;

    @Event({
        eventName: 'cardClicked',
        composed: true,
        cancelable: true,
        bubbles: true
    }) cardClicked: EventEmitter;

    @Element()
    public element: HTMLElement;

    
    private cardClick() {
        let event = {
            value: this.postId,
        }
        this.cardClicked.emit(event);
    }


    public render() {
        if (this.priority == "urgent") {
            return (
                <div class="urgent card" id={`${this.postId}`} onClick={this.cardClick.bind(this)}>
                    <h1>{this.header}</h1>
                    <h3>{this.subTitle}</h3>
                </div>
            );
        } else {
            return (
                <div class="card" id={`${this.postId}`} onClick={this.cardClick.bind(this)}>
                    <h1>{this.header}</h1>
                    <h3>{this.subTitle}</h3>
                </div>
            );
        }
    }
}
