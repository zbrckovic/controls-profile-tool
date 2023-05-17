export class ControlConfig {
    constructor(
        readonly command: string,
        readonly category: string,
        readonly modifiers: Record<string, string | undefined>
    ) {
    }
}