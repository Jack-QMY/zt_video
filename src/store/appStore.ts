import { makeAutoObservable } from 'mobx';

class App {
    currentRouteName: string = '';
    client: Record<string, any> = {};
    viewportHeight: number = Device.HEIGHT;
    constructor() {
        makeAutoObservable(this);
    }
}
export default new App();
