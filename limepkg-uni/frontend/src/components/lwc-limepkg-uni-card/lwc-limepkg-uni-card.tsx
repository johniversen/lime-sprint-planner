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
    public priority: string;

    @Prop()
    public optionalInfo: {}

    @Prop()
    public postId: number;

    @Prop()
    public cardTitle: string;

    @Prop()
    public cardData: {}

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
        let cardDataOutput = []
        for (const [key, value] of Object.entries(this.cardData)) {
            cardDataOutput.push(<p>{key + ':' + value}</p>)
        }
        if (this.optionalInfo['Priority'] !== null && this.optionalInfo['Priority'] == "urgent") {
            return (
                <div class="urgent card" id={`${this.postId}`} onClick={this.cardClick.bind(this)}>
                    <limel-icon class="card_icon" name="fire_element" size="medium" />
                    <h1>{this.cardTitle}</h1>
                    <h3>{cardDataOutput}</h3>
                </div>
            );
        } else {
            return (
                <div class="card" id={`${this.postId}`} onClick={this.cardClick.bind(this)}>
                    <h1>{this.cardTitle}</h1>
                        {cardDataOutput}
                </div>
            );
        }
    }
}
