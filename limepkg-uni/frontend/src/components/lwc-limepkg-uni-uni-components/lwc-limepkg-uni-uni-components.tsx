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

    @State()
    private outputLeftList: String;
    private outputMiddleList: String;
    private outputRightList: String;
    
    @State()
    private dialog = <limel-dialog/>;

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
        console.log(limeType)
        this.http.get(`https://localhost/lime/limepkg-uni/test/?limetype=` + limeType).then(res => {
            this.updateData(res);
            console.log(res);
        });
    }

    private updateData = (res) => {
        this.section = res.objects.map(el => {
            return this.section = { ...el };
        });
        //this.createOutPut();
        console.log("update data");
        console.log(this.section);
        this.createOutPut2();
    }

    private createOutPut2() {
        let outPutList: Array<ListItem<any> | ListSeparator> = [];
        let currentStatus = this.section[0].status;
        let index = 0;
        this.section.forEach(object => {
            let item = {
                text: object.title,
                secondaryText: "Priority: " + object.priority + " Status: " + object.status,
                value: index++,
            }
            if(currentStatus == object.status) {
                console.log("första if sats: " + object.status)
                console.log(item);
                outPutList.push(
                    (item as ListItem),
                    { separator: true })
            } else {
                console.log("Else sats: " + object.status);
                console.log(item);
            this.listContainer.push(outPutList);
            console.log(this.listContainer);
            currentStatus = object.status;
            outPutList = [];
            outPutList.push(
                (item as ListItem),
                { separator: true })
            }
        })
        this.listContainer.push(outPutList);
        console.log("List container");
        console.log(this.listContainer);
    }


    private openDialog(event: CustomEvent<ListItem>) {
        console.log("open dialog");
        this.dialogIsOpen = true;
        this.dialog = this.section.map(item => {
            if (item.title === event.detail.text) {
                return (
                <limel-dialog open={this.dialogIsOpen} onClose={this.closeDialog}>
                    <p>{item.title}</p>
                    <p>{item.priority}</p>
                    <p>{item.misc}</p>
                    <p>{item.comment}</p>
                    <p>{item.status}</p>
                    <limel-flex-container justify="end" slot="button">
                        <limel-button primary={true} label="Close" onClick={this.closeDialog} />
                    </limel-flex-container>
                </limel-dialog>
                )
            }
        });

        console.log(this.dialog);
        console.log(this.dialogIsOpen);
        
        return event.detail; 
    }

    private closeDialog() {
        console.log("Close dialog");
        this.dialogIsOpen = false;
        console.log(this.dialog);
        console.log(this.dialogIsOpen);
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
             <limel-flex-container direction = {'vertical'} align = {"stretch"} justify ={"start"}>
                 <limel-button label={"Deals"} onClick={this.getDeals.bind(this)}/>
                <limel-list type="selectable" onChange={this.openDialog} items={list} />
            </limel-flex-container>
            )
        })

        return (
            <limel-flex-container direction={"horizontal"} align={"start"} justify={"space-between"}>
                {output}
            </limel-flex-container>
        );
    }
}