export async function parseKimchiCsv(file: File): Promise<string[]> {
    type KimchiHeader = "word" | "kimchiKnownLevel";
    type KimchiCsv = { [key in KimchiHeader]: string | number }

    const content = await file.text();
    const rows = content.split("\n");

    if (rows.length === 0) throw new Error("Invalid Kimchi export file.");

    const headers: KimchiHeader[] = ["word", "kimchiKnownLevel"];

    const structured_data = rows.slice(1).map(row => {
        const values = row.split(",");
        if (values.length !== 2) throw new Error("Invalid Kimchi export file.");

        return headers.reduce((acc, header, index) => {
            acc[header.trim() as KimchiHeader] = values[index]?.trim();
            return acc;
        }, {} as KimchiCsv);
    });

    const words = structured_data.map(data => data.word as string);
    return words;
}
