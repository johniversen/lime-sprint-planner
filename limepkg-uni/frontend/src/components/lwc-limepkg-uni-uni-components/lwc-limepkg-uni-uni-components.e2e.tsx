import { newE2EPage } from '@stencil/core/testing';

describe('lwc-limepkg-uni-uni-components', () => {
    let page;
    beforeEach(async () => {
        page = await newE2EPage();
    });

    describe('render', () => {
        let button;
        beforeEach(async () => {
            await page.setContent(`
                <lwc-limepkg-uni-uni-components></lwc-limepkg-uni-uni-components>
            `);
            await page.find('lwc-limepkg-uni-uni-components');

            // `>>>` means that `limel-button` is inside the
            // shadow-DOM of `lwc-limepkg-uni-uni-components`
            button = await page.find(`
                lwc-limepkg-uni-uni-components >>> limel-button
            `);
        });
        it('displays the correct label', () => {
            expect(button).toEqualAttribute('label', 'Hello World!');
        });
    });
});
