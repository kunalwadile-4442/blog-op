import Blog from "@/models/blogModel";
import { connectDB } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body || !body.title || !body.previewText || !body.content || !body.coverImage || !body.author) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const words = body.content.trim().split(/\s+/).length;
        const readTime = Math.ceil(words / 200);

        const blog = new Blog({
            ...body,
            readTime,
            comments: [],
        });

        await blog.save();

        return NextResponse.json({ success: true, blog }, { status: 201 });
    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
