import { ApplicationConsumer } from '../application.jsx';

describe('Application Consumer', () => {
    it('should export the consumer component', () => {
        expect(ApplicationConsumer).toBeDefined();
        expect(typeof ApplicationConsumer).toEqual('object');
    });
});
