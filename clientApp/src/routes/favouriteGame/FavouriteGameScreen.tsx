import {Button} from "../../components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../components/ui/form.tsx";
import {Input} from "../../components/ui/input.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useContext, useEffect, useState} from "react";
import {z} from "zod";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import getAuthHeader from "../../repositories/AxiosHeader.ts";
import {AppContext} from "../../App.tsx";
import Loading from "../../components/Loading.tsx";

const formSchema = z.object({
    name: z
        .string()
        .min(5),
    description: z
        .string()
        .min(5),
    image: z.string(),
    genres: z.string(),
    developer: z
        .string()
        .min(5)
})

type formSchemaType = z.infer<typeof formSchema>

interface FavouriteGame {
    id: number
    title: string
    description: string
    image: string
    genres: string[]
    developer: string
}

export default function FavouriteGameScreen() {
    const context = useContext(AppContext)
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", genres: "", image: "", description: "", developer: "" }
    })

    const [genres, setGenres] = useState<string[]>([])
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const genreText = form.watch("genres")
    
    const mutation = useMutation({
        mutationFn: async (data: object) => {
            return await axios.post("/api/favourite", data, getAuthHeader(context.token))
        }
    })
    const userFavouritesQuery = useQuery<FavouriteGame[]>({
        queryKey: ["favourite-games"],
        queryFn: async () => {
            return (await axios.get("/api/favourite", getAuthHeader(context.token))).data
        }
    })

    useEffect(() => {
        if (genreText.length <= 1) return
        let text = genreText.trimStart()

        if (text[text.length - 1] == " ") {
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
        setIsAddDialogVisible(false)
        mutation.mutate({
            title: data.name,
            description: data.description,
            genres: genres,
            developer: data.developer,
            image: data.image
        })
    }
    
    function getApiUrl(): string {
        const payload = JSON.parse(atob(context.token.split(".")[1]))
        return `${location.protocol}//${location.host}/api/favourite/${payload.nameid}`
    }

    return (
        <div className="flex flex-col w-[700px] mx-auto py-8">
            <Dialog open={isAddDialogVisible} onOpenChange={setIsAddDialogVisible}>
                <DialogTrigger asChild>
                    <Button className="ml-auto">Add game</Button>
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

                            <FormField
                                control={form.control}
                                name="developer"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Developer</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button className="mt-2" type="submit">Create</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            
            <div className="flex flex-col mt-4">
                <p className="mb-2 font-bold">Your API URL</p>
                <p>{getApiUrl()}</p>
            </div>

            <div className="mt-4 gap-4 grid grid-cols-2 mx-auto">
                {userFavouritesQuery.isLoading && <Loading />}
                {userFavouritesQuery.isSuccess && userFavouritesQuery.data.map(game => (
                    <GameInfoCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    )
}

function GameInfoCard(props: { game: FavouriteGame }) {
    const game = props.game
    
    return (
        <div className="flex flex-col gap-1 p-3 bg-gray-300 w-[300px] rounded-md shadow-md">
            <div className="w-full rounded-md h-64 overflow-hidden shadow-md">
                <img src={game.image} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="font-bold text-xl">{game.title}</p>
            <p className="text-sm mb-4">{game.description}</p>
            <p>Genres: {game.genres.join(", ")}</p>
            <p>Developer: {game.developer}</p>
        </div>
    )
}