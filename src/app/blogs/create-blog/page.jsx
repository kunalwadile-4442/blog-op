"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import BlogEditor from "@/components/BlogEditor"
import { Textarea } from "@/components/ui/textarea"

// export default function CreateBlogPage() {
//     const [body, setBody] = useState({
//         title: '',
//         previewText: '',
//         content: '',
//         coverImage: ''
//     })
//     const [uploadingImage, setUploadingImage] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const { data: session } = useSession()
//     const router = useRouter()
//     const { theme } = useTheme()

//     const handleContentChange = (newContent) => {
//         setBody((prevState) => ({
//             ...prevState,
//             content: newContent
//         }));
//     };

//     const handleCreateBlog = async (e) => {
//         e.preventDefault()
//         if (!body.coverImage) {
//             toast.error("Blog Cover Image is Required")
//             return;
//         }
//         const blogData = {
//             ...body,
//             author: session.user.id
//         }
//         console.log("blogData",blogData);
//         setLoading(true)
//         try {
//             const res = await fetch('/api/blog/create', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(blogData),
//             })

//             if (res.ok) {
//                 router.push('/dashboard')
//             } else {
//                 console.log("Error:", res.statusText);
//                 toast.error("Failed to create the blog.", {
//                     autoClose: 4000,
//                     theme: theme === "light" ? "light" : "dark",
//                 });
//             }
//         } catch (error) {
//             console.log("Error:", error);
//             toast.error("Something went wrong.", {
//                 autoClose: 4000,
//                 theme: theme === "light" ? "light" : "dark",
//             });
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleImageUpload = async (e) => {
//         const file = e.target.files[0]; // Get the selected file
//         if (!file) return;
//         setUploadingImage(true)
//         const formData = new FormData();
//         formData.append("file", file); // Add the file to the request
//         formData.append("upload_preset", "blognew"); // Replace with your upload preset name

//         try {
//             const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_API_URL, {
//                 method: "POST",
//                 body: formData,
//             });

//             const data = await res.json();
//             if (!body.coverImage) {
//                 toast.error(" image upload faield, please try again!!!", {
//                     autoClose: 4000,
//                     theme: theme === "light" ? "light" : "dark",
//                 });
//                 return;
//             }
//             if (data.secure_url) {
//                 setBody((prevBody) => ({ ...prevBody, coverImage: data.secure_url })); // Save the URL in state
//             }
//         } catch (error) {
//             toast.error("Failed to upload image.", {
//                 autoClose: 4000,
//                 theme: theme === "light" ? "light" : "dark",
//             });
//             console.error("Error uploading image:", error);
//         } finally {
//             setUploadingImage(false)
//         }
//     };


//     return (
//         <div className="container mx-auto px-4 py-8">
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="text-3xl">Create New Blog Post</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleCreateBlog}>
//                         <fieldset disabled={loading}>
//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="title">Title</Label>
//                                     <Input id="title" name="title" value={body.title} onChange={(e) => setBody({ ...body, title: e.target.value })} placeholder="Enter your blog title" required />
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="previewText">Preview Text</Label>
//                                     <Textarea
//                                         id="previewText"
//                                         name="previewText"
//                                         value={body.previewText}
//                                         onChange={(e) => setBody({ ...body, previewText: e.target.value })}
//                                         placeholder="Write a short preview of your blog"
//                                         rows={2}
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="content">Content</Label>
//                                     <BlogEditor value={body.content} onEditorChange={handleContentChange} disabled={loading} />
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="coverImage">Cover Image</Label>
//                                     <Input id="coverImage" name="coverImage" type="file" accept="image/*" onChange={handleImageUpload} required />
//                                 </div>
//                             </div>
//                             <Button className="mt-5">
//                                 {loading ? <span className='flex items-center gap-1'><Loader2 className='animate-spin h-5 w-5' />Publishing Post</span> : "Publish Post"}
//                             </Button>
//                         </fieldset>
//                     </form>
//                 </CardContent>
//             </Card>
//             <ToastContainer />
//             <AlertDialog open={uploadingImage}>
//                 <AlertDialogContent className='max-w-80'>
//                     <AlertDialogHeader className="flex gap-3 items-center ">
//                         <AlertDialogTitle className='sr-only'>Uploading Image</AlertDialogTitle>
//                         <Loader2 className="animate-spin h-7 w-7" />
//                         <AlertDialogDescription className='font-medium'>Uploading Image...</AlertDialogDescription>
//                     </AlertDialogHeader>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </div>
//     )
// }

export default function CreateBlogPage() {
    const [body, setBody] = useState({
        title: '',
        previewText: '',
        content: '',
        coverImage: ''
    })
    const [uploadingImage, setUploadingImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()
    const { theme } = useTheme()

    const handleContentChange = (newContent) => {
        setBody((prevState) => ({
            ...prevState,
            content: newContent
        }));
    };

    const handleCreateBlog = async (e) => {
        e.preventDefault()
        if (!body.coverImage) {
        toast.error(" Blog Cover Image is Required!!!", {
                autoClose: 4000,
                theme: theme === "light" ? "light" : "dark",
            });
            return;
        }
        const blogData = {
            ...body,
            author: session.user.id
        }
        console.log("blogData", blogData);
        setLoading(true)
        try {
            const res = await fetch('/api/blog/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogData),
            })

            if (res.ok) {
                router.push('/dashboard')
                toast.success("blog upload succesfull!!!", {
                    autoClose: 4000,
                    theme: theme === "light" ? "light" : "dark",
                });
            } else {
                console.log("Error:", res.statusText);
                toast.error("Failed to create the blog.", {
                    autoClose: 4000,
                    theme: theme === "light" ? "light" : "dark",
                });
            }
        } catch (error) {
            console.log("Error:", error);
            toast.error("Something went wrong.", {
                autoClose: 4000,
                theme: theme === "light" ? "light" : "dark",
            });
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]; // Get the selected file
        console.log("file",file)
        if (!file) return;
        setUploadingImage(true)
        const formData = new FormData();
        formData.append("file", file); // Add the file to the request
        formData.append("upload_preset", "blognew"); // Replace with your upload preset name

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_API_URL, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!data.secure_url) {
                toast.error("Image upload failed, please try again!!!", {
                    autoClose: 4000,
                    theme: theme === "light" ? "light" : "dark",
                });
                return;
            } else {
                toast.success("Image upload succesfull!!!", {
                    autoClose: 4000,
                    theme: theme === "light" ? "light" : "dark",
                });
            }
            if (data.secure_url) {
                setBody((prevBody) => ({ ...prevBody, coverImage: data.secure_url })); // Save the URL in state
            }
        } catch (error) {
            toast.error("Failed to upload image.", {
                autoClose: 4000,
                theme: theme === "light" ? "light" : "dark",
            });
            console.error("Error uploading image:", error);
        } finally {
            setUploadingImage(false)
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Create New Blog Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateBlog}>
                        <fieldset disabled={loading}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" name="title" value={body.title} onChange={(e) => setBody({ ...body, title: e.target.value })} placeholder="Enter your blog title" required />
                                </div>
                                <div>
                                    <Label htmlFor="previewText">Preview Text</Label>
                                    <Textarea
                                        id="previewText"
                                        name="previewText"
                                        value={body.previewText}
                                        onChange={(e) => setBody({ ...body, previewText: e.target.value })}
                                        placeholder="Write a short preview of your blog"
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="content">Content</Label>
                                    <BlogEditor value={body.content} onEditorChange={handleContentChange} disabled={loading} />
                                </div>
                                <div>
                                    <Label htmlFor="coverImage">Cover Image</Label>
                                    <Input id="coverImage" name="coverImage" type="file" accept="image/*" onChange={handleImageUpload} required />
                                </div>
                                {/* Display uploaded image */}
                                <div className="mt-4">
                                    {body.coverImage && (
                                        <img src={body.coverImage} alt="Cover Image" className="max-w-full rounded-lg" />
                                    )}
                                </div>
                            </div>
                            <Button className="mt-5">
                                {loading ? <span className='flex items-center gap-1'><Loader2 className='animate-spin h-5 w-5' />Publishing Post</span> : "Publish Post"}
                            </Button>
                        </fieldset>
                    </form>
                </CardContent>
            </Card>
            <ToastContainer />
            <AlertDialog open={uploadingImage}>
                <AlertDialogContent className='max-w-80'>
                    <AlertDialogHeader className="flex gap-3 items-center ">
                        <AlertDialogTitle className='sr-only'>Uploading Image</AlertDialogTitle>
                        <Loader2 className="animate-spin h-7 w-7" />
                        <AlertDialogDescription className='font-medium'>Uploading Image...</AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}