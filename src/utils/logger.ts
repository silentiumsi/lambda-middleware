class Logger {
    private context: Record<string, unknown> = {}

    addContext(context: Record<string, string>) {
        this.context = { ...this.context, context}
    }

    log(message: Record<string, unknown>) {
        console.log({ ...this.context, message });
    }
}

export default new Logger();