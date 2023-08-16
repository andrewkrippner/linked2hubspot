import readline from 'readline'

export const promptUser = (query: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise((resolve) =>
        rl.question(query, (ans) => {
            resolve(ans)
            rl.close()
        })
    )
}
