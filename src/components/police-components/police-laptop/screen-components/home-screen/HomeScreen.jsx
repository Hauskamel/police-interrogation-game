



export function HomeScreen () {

    const now = new Date();
    const nowString = now.toString();

    console.log(now);
    

    return (
        <>
            {nowString}
        </>
    )
}

