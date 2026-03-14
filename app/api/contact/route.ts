import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        // Send submission to Web3Forms
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: "bc663958-5184-43eb-989f-540d71d68241",
                name,
                email,
                message,
            }),
        });

        const data = await response.json();

        if (data.success) {
            console.log("Email sent successfully via Web3Forms");
            return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
        } else {
            console.error("Web3Forms failed to send email:", data);
            return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
        }
    } catch (error) {
        console.error('Web3Forms Error:', error);
        return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
    }
}
