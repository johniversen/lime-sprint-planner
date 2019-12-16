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
    public CardTitle: string;

    @Prop()
    public cardData: {}

    @Event({
        eventName: 'cardClicked',
        composed: true,
        cancelable: true,
        bubbles: true
    }) cardClicked: EventEmitter;

    @Event({
        eventName: 'cardDragged',
        composed: true,
        cancelable: true,
        bubbles: true
    }) cardDragged: EventEmitter;

    @Element()
    public element: HTMLElement;

    private cardClick() {
        let event = {
            value: this.postId,
        }
        this.cardClicked.emit(event);
    }

    private cardDrag() {
        this.cardDragged.emit(this.postId);
    }

    public render() {
        let cardDataOutput = []
        for (const [key, value] of Object.entries(this.cardData)) {
            if (!(value === "" || value === {} || typeof value ==='undefined')) {
                cardDataOutput.push(<p>{key + ': ' + value}</p>)
            }
        }
        if (this.optionalInfo['Priority'] !== null && this.optionalInfo['Priority'] == "urgent") {
            return (
                <div class="urgent card" id={`${this.postId}`} onClick={this.cardClick.bind(this)} draggable={true} onDragStart={this.cardDrag.bind(this)}>
                    <limel-icon class="card_icon" name="fire_element" size="medium" />
                    <h1>{this.CardTitle}</h1>
                    <h3>{cardDataOutput}</h3>
                </div>
            );
        } else {
            return (
                <div class="card" id={`${this.postId}`} onClick={this.cardClick.bind(this)} draggable={true} onDragStart={this.cardDrag.bind(this)}>
                    <h1>{this.CardTitle}</h1>
                    <h3>{cardDataOutput}</h3>
                </div>
            );
        }
    }
}
