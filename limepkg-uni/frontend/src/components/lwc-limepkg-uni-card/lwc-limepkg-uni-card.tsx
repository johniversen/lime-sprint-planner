import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, Event, EventEmitter } from '@stencil/core';
import { ListItem } from '@limetech/lime-elements';

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

    //@Prop()
    //public header: string;

    //  @Prop()
    // public subTitle: string;

   // @Prop()
    //public postId: number;

    @Prop()
    public priority: string;


    @Prop()
    public reqInfo: {
        header: String,
        postId: number
    }

    @Prop()
    public additionalInfo: Array<ListItem<any>> = [];

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
            value: this.reqInfo.postId,
        }
        this.cardClicked.emit(event);
    }


    public render() {
        if (this.additionalInfo['priority'] !== null && this.additionalInfo['priority'] == "urgent") {
            return (
                <div class="urgent card" id={`${this.reqInfo.postId}`} onClick={this.cardClick.bind(this)}>
                    <h1>{this.reqInfo.header}</h1>
                    <limel-list items={this.additionalInfo}></limel-list>
                    <h3></h3>
                </div>
            );
        } else {
            return (
                <div class="card" id={`${this.reqInfo.postId}`} onClick={this.cardClick.bind(this)}>
                    <h1>{this.reqInfo.header}</h1>
                    <limel-list items={this.additionalInfo}></limel-list>
                </div>
            );
        }
    }
}
