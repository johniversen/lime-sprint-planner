import { newE2EPage } from '@stencil/core/testing';

describe('lwc-limepkg-uni-framework', () => {
    let page;
    beforeEach(async () => {
        page = await newE2EPage();
    });

    describe('render', () => {
        let button;
        beforeEach(async () => {
            await page.setContent(`
                <lwc-limepkg-uni-framework></lwc-limepkg-uni-framework>
            `);
            await page.find('lwc-limepkg-uni-framework');

            // `>>>` means that `limel-button` is inside the
            // shadow-DOM of `lwc-limepkg-uni-framework`
            button = await page.find(`
                lwc-limepkg-uni-framework >>> limel-button
            `);
        });
        it('displays the correct label', () => {
            expect(button).toEqualAttribute('label', 'Hello World!');
        });
    });
});
