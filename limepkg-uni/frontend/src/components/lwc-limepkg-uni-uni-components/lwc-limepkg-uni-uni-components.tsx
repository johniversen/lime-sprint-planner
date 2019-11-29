import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    //NotificationService,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { ListItem } from '@limetech/lime-elements';

@Component({
    tag: 'lwc-limepkg-uni-uni-components',
    shadow: true,
    styleUrl: 'lwc-limepkg-uni-uni-components.scss',
})

export class UniComponents implements LimeWebComponent {
    @Prop()
    platform: LimeWebComponentPlatform;

    @Prop()
    context: LimeWebComponentContext;

    @Element()
    element: HTMLElement;

    @Prop()
    mainData: [{
        title: string,
        secondaryText: string,
        priorityValue: number,
        status: string,
        postId: number
    }];

    @Prop()
    onListItemClick: (event: CustomEvent<ListItem>) => void;

    @Prop()
    dragObjectID: string;

    @State()
    private listContainer = [];

    constructor() {
        this.createOutPut = this.createOutPut.bind(this);
        this.allowDrop = this.allowDrop.bind(this);
        this.getDragObjectID = this.getDragObjectID.bind(this);
        this.drop = this.drop.bind(this);
    }

    public componentWillRender() {
        //console.log("componentWillRender")
        this.createOutPut();
    }

    private createOutPut() {
        this.mainData.sort((a, b) => (a.priorityValue > b.priorityValue) ? 1 : ((b.priorityValue > a.priorityValue) ? -1 : 0));
        this.listContainer = [];
        let outPutList = [];
        outPutList.push(<h4 class="column-header">{this.mainData[0].status}</h4>)
        let currentStatus = this.mainData[0].priorityValue;
        //Måste läggas i Config vilken Header man vill ha på respektive lista?
        this.mainData.forEach(object => {
            let secondaryText = null;
            if (object.secondaryText != null) {
                secondaryText = object.secondaryText;
            }
            let item = <div id={'card' + object.postId} draggable={true} onDragStart={this.getDragObjectID}>
                    <lwc-limepkg-uni-card header={object[Object.keys(object)[0]]} subTitle={secondaryText} postId={object.postId} clickHandler={this.onListItemClick} />
                </div>
                

            if (currentStatus == object.priorityValue) {
                outPutList.push(item)
            } else {
                this.listContainer.push(outPutList);
                currentStatus = object.priorityValue;
                outPutList = [];
                outPutList.push(<h4 class="column-header">{object.status}</h4>)
                outPutList.push(item);
            }
        })
        this.listContainer.push(outPutList);
    }

    private allowDrop(event) {
        event.preventDefault();
    }

    private getDragObjectID(event) {
        console.log("ID för detta = " + event.target.id);
        this.dragObjectID = event.target.id;
    }

    private drop(event) {
        console.log("Mottaget ID = " + this.dragObjectID);
        event.target.append(this.element.querySelector('card' + this.dragObjectID));
    }

    public render() {
        //console.log("Render i main-grid-compoennt");
        let output = this.listContainer.map(list => {
            //console.log(list[0])
            return (
                <div onDragOver={this.allowDrop} onDrop={this.drop}>
                    <limel-flex-container direction={'vertical'} align={"stretch"} justify={"start"}>
                        {list}
                    </limel-flex-container>
                </div>
            )
        })
        return (
            <limel-flex-container class="card" direction={"horizontal"} align={"center"} justify={"space-evenly"}>
                {output}
            </limel-flex-container>
        );
    }
}