import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    //NotificationService,
    PlatformServiceName,
    HttpService
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { ListItem, ListSeparator } from '@limetech/lime-elements';

@Component({
    tag: 'lwc-limepkg-uni-uni-components',
    shadow: true,
    styleUrl: 'lwc-limepkg-uni-uni-components.scss',
})

// Test

export class UniComponents implements LimeWebComponent {
    @Prop()
    public platform: LimeWebComponentPlatform;

    @Prop()
    public context: LimeWebComponentContext;

    @Element()
    public element: HTMLElement;

    @State()
    private section = [{
        title: null,
        priority: null,
        misc: null,
        comment: null,
        status: null
    }];

    @State()
    private listContainer = [];

    @State()
    private dialogIsOpen = false;

    private dialog = <limel-dialog />;

    private http: HttpService;

    constructor() {
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    public componentWillLoad() {
        this.http = this.platform.get(PlatformServiceName.Http);
        console.log("componentWillLoad");
        this.getDataFromEndPoint("solutionimprovement")

    }

    private getDataFromEndPoint(limeType) {
        this.http.get(`https://localhost/lime/limepkg-uni/test/?limetype=` + limeType).then(res => {
            this.updateData(res);
        });
    }

    private updateData = (res) => {
        this.section = res.objects.map(el => {
            return this.section = { ...el };
        });


        this.createOutPut();
    }

    private createOutPut() {
        let outPutList: Array<ListItem<any> | ListSeparator> = [];
        let currentStatus = this.section[0].status;
        let index = 0;
        this.section.forEach(object => {
            let item = {
                text: object.title,
                secondaryText: "Priority: " + object.priority + " Status: " + object.status,
                value: index++,
                open: "false"
            }
            if (currentStatus == object.status) {
                outPutList.push(
                    (item as ListItem),
                    { separator: true })
            } else {

                this.listContainer.push(outPutList);
                currentStatus = object.status;
                outPutList = [];
                outPutList.push(
                    (item as ListItem),
                    { separator: true })
            }
        })
        this.listContainer.push(outPutList);
    }


    private openDialog(event: CustomEvent<ListItem>) {
        console.log("open dialog");
        this.dialogIsOpen = true;
        let item = this.section.find(obj => obj.title === event.detail.text);
        this.dialog = <limel-dialog open={this.dialogIsOpen} onClose={this.closeDialog}>
            <h1>{item.title}</h1>
            <p>{"Priority: " + item.priority}</p>
            <p>{"Misc: " + item.misc}</p>
            <p>{"Comment: " + item.comment}</p>
            <p>{"Status: " + item.status}</p>
            <limel-flex-container justify="end" slot="button">
                <limel-button primary={true} label="Close" onClick={this.closeDialog} />
            </limel-flex-container>

        </limel-dialog>
        return event.detail;
    }

    private closeDialog() {
        console.log("Close dialog");
        this.dialogIsOpen = false;
        this.dialog = null;
    }
    private getDeals() {
        this.listContainer = [];
        this.getDataFromEndPoint("deal");
    }


    public render() {
        console.log("Render()");
        console.log(this.dialog);
        console.log(this.section);
        let output = this.listContainer.map(list => {
            return (
                <limel-flex-container class="column-class" direction={'vertical'} align={"stretch"} justify={"start"}>
                    <limel-list type="selectable" onChange={this.openDialog} items={list}  />
                </limel-flex-container>
            )
        })

        return (
            <limel-flex-container class="card" direction={"horizontal"} align={"start"} justify={"space-between"}>
                <limel-button label={"Deals"} onClick={this.getDeals.bind(this)} />
                {this.dialog}
                {output}
            </limel-flex-container>
            
        );
    }
}