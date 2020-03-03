export class Cooldown {
    private lastEntry: Date = null;

    constructor(private cooldownSeconds) { }

    public setEntry() {
        this.lastEntry = new Date();
    }

    public isReady(): boolean {
        if (!this.lastEntry) { return true; }

        return this.lastEntry.getTime() / 1000 + this.cooldownSeconds <= new Date().getTime() / 1000;
    }
}
