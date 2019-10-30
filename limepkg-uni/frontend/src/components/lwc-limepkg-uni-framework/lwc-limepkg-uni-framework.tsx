import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    //NotificationService,
    //PlatformServiceName,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop } from '@stencil/core';

@Component({
    tag: 'lwc-limepkg-uni-framework',
    shadow: true,
    styleUrl: 'lwc-limepkg-uni-framework.css',
})
export class Framework implements LimeWebComponent {
    @Prop()
    public platform: LimeWebComponentPlatform;

    @Prop()
    public context: LimeWebComponentContext;

    @Element()
    public element: HTMLElement;

    public render() {
        return (
            <div id="grid-container">
                <header>
                    <h1>Heading</h1>
                    <select class="dropdown">
                        <option value="default"> Filter </option>
                        <option value="filter 1"> Filter 1</option>
                        <option value="filter 2"> Filter 2</option>
                    </select>
                    <div id="week-display">
                        <p>Vecka x</p>
                    </div>
                </header>
                <div id="urgent"> AKUT AKUT !!!</div>
                <main>
                    <section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                    </section>
                    <section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                    </section>
                    <section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                    </section>
                    <section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                    </section>
                    <section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                    </section>
                    <section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla</p>
                        </div>
                    </section>
                </main>

            </div>
        );
    }
}
