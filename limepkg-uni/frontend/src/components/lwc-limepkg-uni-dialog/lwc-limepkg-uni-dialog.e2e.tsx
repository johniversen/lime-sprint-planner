import { newE2EPage } from '@stencil/core/testing';

describe('lwc-limepkg-uni-dialog', () => {
    let page;
    beforeEach(async () => {
        page = await newE2EPage();
    });

    describe('render', () => {
        let button;
        beforeEach(async () => {
            await page.setContent(`
                <lwc-limepkg-uni-dialog></lwc-limepkg-uni-dialog>
            `);
            await page.find('lwc-limepkg-uni-dialog');

            // `>>>` means that `limel-button` is inside the
            // shadow-DOM of `lwc-limepkg-uni-dialog`
            button = await page.find(`
                lwc-limepkg-uni-dialog >>> limel-button
            `);
        });
        it('displays the correct label', () => {
            expect(button).toEqualAttribute('label', 'Hello World!');
        });
    });
});
