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
        postId: number,
        priority: string
    }];

    @Prop()
    limeTypeMetaData: {}

    @Prop()
    onListItemClick: (event: CustomEvent<ListItem>) => void;

    @Prop()
    dragObjectID: string;

    @State()
    private listContainer = [];

    constructor() {
        this.createOutput = this.createOutput.bind(this);
        this.allowDrop = this.allowDrop.bind(this);
        this.getDragObjectID = this.getDragObjectID.bind(this);
        this.drop = this.drop.bind(this);
    }

    public componentWillRender() {
        this.createOutput();
    }

    private createOutput() {
        this.mainData.sort((a, b) => (a.priorityValue > b.priorityValue) ? 1 : ((b.priorityValue > a.priorityValue) ? -1 : 0));
        console.log(this.limeTypeMetaData);
        let columnList = []
        this.listContainer = [];

        Object.keys(this.limeTypeMetaData['prio']).forEach((key) => {
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
                <lwc-limepkg-uni-card header={object.title} subTitle={secondaryText} postId={object.postId} priority={object.priority} />

            let temp = columnList.find(col => col.prio === object.priorityValue);
            temp['items'].push(item);
        })
        columnList.forEach(column => {
            this.listContainer.push(column.items);
        })
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
        console.log("Render i main-grid-compoennt");
        let output = this.listContainer.map(list => {
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