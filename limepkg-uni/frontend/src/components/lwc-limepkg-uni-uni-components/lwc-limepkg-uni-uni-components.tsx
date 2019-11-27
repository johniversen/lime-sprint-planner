import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    //NotificationService,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { ListItem } from '@limetech/lime-elements';
import { forEachChild } from 'typescript';

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
        postId: number,
        priority: string
    }];

    @Prop()
    limeTypeMetaData: {}

    @Prop()
    onListItemClick: (event: CustomEvent<ListItem>) => void;

    @State()
    private listContainer = [];

    constructor() {
        this.createOutPut = this.createOutPut.bind(this);
    }
    public componentWillRender() {
        //console.log("componentWillRender")
        this.createOutPut();
    }
    



    private createOutPut() {
        this.mainData.sort((a, b) => (a.priorityValue > b.priorityValue) ? 1 : ((b.priorityValue > a.priorityValue) ? -1 : 0));
        console.log(this.limeTypeMetaData);
        let columnList = []
        this.listContainer = [];

        Object.keys(this.limeTypeMetaData['prio']).forEach((key, index) => {
            let column = {
                header: key,
                prio: this.limeTypeMetaData['prio'][key],
                items: []
            }
            column.items.push(<h4 class="column-header">{column.header}</h4>)
            columnList.push(column);
        })

        columnList.sort((a, b) => (a.prio > b.prio) ? 1 : ((b.prio > a.prio) ? -1 : 0));
        this.listContainer = [];

        this.mainData.forEach(object => {
            let secondaryText = null;
            if (object.secondaryText != null) {
                secondaryText = object.secondaryText;
            }
            let item =
                <lwc-limepkg-uni-card header={object.title} subTitle={secondaryText} postId={object.postId} priority={object.priority} clickHandler={this.onListItemClick} />

            let temp = columnList.find(col => col.prio === object.priorityValue);
            temp['items'].push(item);
        })
        columnList.forEach(column => {
            this.listContainer.push(column.items);
        })

        //let currentStatus = this.mainData[0].priorityValue;
        //Måste läggas i Config vilken Header man vill ha på respektive lista?
        /*         this.mainData.forEach(object => {
                    let secondaryText = null;
                    if (object.secondaryText != null) {
                        secondaryText = object.secondaryText;
                    }
                    let item =
                        <lwc-limepkg-uni-card header={object.title} subTitle={secondaryText} postId={object.postId} priority={object.priority} clickHandler={this.onListItemClick} />
        
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
                this.listContainer.push(outPutList); */

    }

    public render() {
        //console.log("Render i main-grid-compoennt");
        let output = this.listContainer.map(list => {
            //console.log(list[0])
            return (
                <limel-flex-container direction={'vertical'} align={"stretch"} justify={"start"}>
                    {list}
                </limel-flex-container>
            )
        })
        return (
            <limel-flex-container class="card" direction={"horizontal"} align={"center"} justify={"space-evenly"}>
                {output}
            </limel-flex-container>
        );
    }
}