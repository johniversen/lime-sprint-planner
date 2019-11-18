import { newE2EPage } from '@stencil/core/testing';

describe('lwc-limepkg-uni-card', () => {
    let page;
    beforeEach(async () => {
        page = await newE2EPage();
    });

    describe('render', () => {
        let button;
        beforeEach(async () => {
            await page.setContent(`
                <lwc-limepkg-uni-card></lwc-limepkg-uni-card>
            `);
            await page.find('lwc-limepkg-uni-card');

            // `>>>` means that `limel-button` is inside the
            // shadow-DOM of `lwc-limepkg-uni-card`
            button = await page.find(`
                lwc-limepkg-uni-card >>> limel-button
            `);
        });
        it('displays the correct label', () => {
            expect(button).toEqualAttribute('label', 'Hello World!');
        });
    });
});
