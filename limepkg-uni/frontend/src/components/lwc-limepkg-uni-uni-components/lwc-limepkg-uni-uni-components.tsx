import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    //NotificationService,
    PlatformServiceName,
    HttpService,
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
        name: null,
        priority: null,
        misc: null,
    }];

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
        }
        );
    }

    private updateData = (res) => {
        this.section = res.objects.map(el => {
            return this.section = { ...el };
        });
        this.createOutPut();
    }

    private createOutPut() {
        let itemsLeftList: Array<ListItem<any> | ListSeparator> = [];
        let itemsMiddleList: Array<ListItem<any> | ListSeparator> = [];
        let itemsRightList: Array<ListItem<any> | ListSeparator> = [];
        let index = 1;
        this.section.forEach(element => {
            const item = {
                text: element.name,
                secondaryText: "Priority: " + element.priority,
                value: index++,
            }
            if (element.priority == "urgent" || element.priority == "rejection" || element.priority == "agreement") {
                itemsLeftList.push(
                    (item as ListItem),
                    { separator: true })
            } else if (element.priority == "wish" || element.priority == "contact" || element.priority == "prospect") {
                itemsMiddleList.push(
                    (item as ListItem),
                    { separator: true })
            } else if (element.priority == "better" || element.priority == "agreement" || element.priority == "active") {
                itemsRightList.push(
                    (item as ListItem),
                    { separator: true }
                )
            }
        }
        )
        this.outputLeftList = <limel-list type="selectable" onChange={this.openDialog} items={itemsLeftList} />
        this.outputMiddleList = <limel-list type="selectable" onChange={this.openDialog} items={itemsMiddleList} />
        this.outputRightList = <limel-list type="selectable" onChange={this.openDialog} items={itemsRightList} />
    }

    private openDialog(event: CustomEvent<ListItem>) {
        console.log("open dialog");
        this.dialogIsOpen = true;
        this.dialog = this.section.map(item => {
            if (item.name === event.detail.text) {
                return (
                <limel-dialog open={this.dialogIsOpen} onClose={this.closeDialog}>
                    <p>{item.name}</p>
                    <p>{item.priority}</p>
                    <p>{item.misc}</p>
                    <limel-flex-container justify="end" slot="button">
                        <limel-button primary={true} label="Close" onClick={this.closeDialog} />
                    </limel-flex-container>
                </limel-dialog>
                )
            }
        })
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

    public render() {
        console.log("Render()");
        console.log(this.dialog);
        return (
            <limel-flex-container direction={"horizontal"} align={"start"} justify={"space-between"}>
                {this.dialog}
                <limel-flex-container direction={"vertical"} align={"stretch"} justify={"start"}>
                    <limel-button outlined={true} label="Get deals" onClick={() => this.getDataFromEndPoint("deal")} />
                    <h3>Priority Urgent</h3>
                    {this.outputLeftList}
                </limel-flex-container>
                <limel-flex-container direction={"vertical"} align={"stretch"} justify={"space-around"}>
                    <limel-button outlined={true} label="Get solution improvements" onClick={() => this.getDataFromEndPoint("solutionimprovement")} />
                    <h3>Priority Wish</h3>
                    {this.outputMiddleList}
                </limel-flex-container>
                <limel-flex-container direction={"vertical"} align={"stretch"} justify={"end"}>
                    <limel-button outlined={true} label="Get Companies" onClick={() => this.getDataFromEndPoint("company")} />
                    <h3>Priority better get started</h3>
                    {this.outputRightList}
                </limel-flex-container>
            </limel-flex-container>
        );
    }
}