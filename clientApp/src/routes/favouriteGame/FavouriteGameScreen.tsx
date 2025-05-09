import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../components/ui/dialog.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "../../components/ui/input.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form.tsx";
import {useEffect, useState} from "react";

const formSchema = z.object({
    name: z
        .string()
        .min(5),
    description: z
        .string()
        .min(5),
    image: z
        .string()
        .min(1),
    genres: z.string(),
    releaseDate: z.date()
})

type formSchemaType = z.infer<typeof formSchema>

export default function FavouriteGameScreen() {
    const form = useForm<formSchemaType>({ resolver: zodResolver(formSchema), defaultValues: { name: "", genres: "", image: "", description: "", releaseDate: new Date() }})
    
    const [genres, setGenres] = useState<string[]>([])
    const genreText = form.watch("genres")
    
    useEffect(() => {
        if (genreText.length <= 1) return
        let text = genreText.trimStart()
        
        if (text[text.length - 1] == " ") {
            console.log("adding")
            const updatedGenres = [...genres]
            
            text = text.substring(0, text.length - 1)
            if (!genres.includes(text)) {
                updatedGenres.push(text)
                setGenres(updatedGenres)
            }
            form.setValue("genres", "")
        }
    }, [genreText]);
    
    function onGenreRemove(genre: string) {
        const updatedGenres = [...genres]
        updatedGenres.splice(updatedGenres.indexOf(genre), 1)
        setGenres(updatedGenres)
    }

    function onSubmit(data: formSchemaType) {
        console.log(data)
    }
    
    return (
        <div className="flex flex-col w-[700px] mx-auto py-8">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="ml-auto">Create favourite game</Button>
                </DialogTrigger>
                <DialogContent>
                        
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <DialogHeader>
                                    <DialogTitle>Add game</DialogTitle>
                                </DialogHeader>
                                
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Game title</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image url</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="genres"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Genres</FormLabel>
                                            <FormControl>
                                                <Input autoComplete="off" {...field} />
                                            </FormControl>
                                            <div className="flex flex-wrap gap-2">
                                                {genres.map(genre => (
                                                    <div key={genre} className="size-max px-2 py-1 bg-gray-400 rounded-md">
                                                        {genre}

                                                        <span onClick={() => onGenreRemove(genre)} className="ml-2 mb-1 select-none hover:cursor-pointer">x</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/*<FormField*/}
                                {/*    control={form.control}*/}
                                {/*    name="genres"*/}
                                {/*    render={({ field }) => (*/}
                                {/*        <FormItem>*/}
                                {/*            <FormLabel>Genres</FormLabel>*/}
                                {/*            <FormControl>*/}
                                {/*                <Input autoComplete="off" {...field} />*/}
                                {/*            </FormControl>*/}
                                {/*            <FormMessage />*/}
                                {/*        </FormItem>*/}
                                {/*    )}*/}
                                {/*/>*/}
                                
                                <DialogFooter>
                                    <Button type="submit">Create</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    
                </DialogContent>
            </Dialog>
        </div>
    )
}