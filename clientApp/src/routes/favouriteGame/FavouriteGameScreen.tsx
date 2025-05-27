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
import {useContext, useRef, useState, KeyboardEvent} from "react";
import {z} from "zod";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import getAuthHeader from "../../repositories/AxiosHeader.ts";
import {AppContext} from "../../App.tsx";
import Loading from "../../components/Loading.tsx";
import {EllipsisVertical} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/ui/dropdown-menu.tsx";

const favouriteGamesKey = ["favourite-games"]
const formSchema = z.object({
    name: z
        .string()
        .nonempty("Title must not be empty")
        .max(64),
    description: z
        .string()
        .nonempty("Description must not be empty")
        .max(128),
    image: z
        .string()
        .nonempty("Image must not be empty")
        .max(256),
    genres: z
        .string()
        .nonempty()
        .max(20, "Each genre can have at most 20 characters")
        .array()
        .min(1, "Must have at least one genre")
        .max(20, "Can have at most 20 genres"),
    developer: z
        .string()
        .nonempty("Developer must not be empty")
        .max(64)
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
    const { queryGames, updateGame, removeGame, createGame } = useFavouriteGameQueries()
    
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", genres: [], image: "", description: "", developer: "" }
    })

    const [genreText, setGenreText] = useState("")
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const editingGame = useRef<FavouriteGame>()
    

    function onGenreInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            if (genreText.length <= 1) return
            let text = genreText.trim()

            const currentGenres = form.getValues("genres")
            if (!currentGenres.includes(text)) {
                form.setValue("genres", [...currentGenres, text])
            }
            setGenreText("")
        }
    }

    function onGenreRemove(genre: string) {
        form.setValue("genres", form.getValues("genres").filter(x => x !== genre))
    }

    function onSubmit(data: formSchemaType) {
        setIsAddDialogVisible(false)
        
        if (isEditing) {
            if (!editingGame.current) throw new Error("Can't edit game")
            
            updateGame.mutate({
                id: editingGame.current.id,
                title: data.name,
                description: data.description,
                image: data.image,
                genres: data.genres,
                developer: data.developer
            })
            
            return
        }
        
        createGame.mutate({
            title: data.name,
            description: data.description,
            genres: data.genres,
            developer: data.developer,
            image: data.image
        })
    }
    
    function onGameEditClick(game: FavouriteGame) {
        form.setValue("name", game.title)
        form.setValue("description", game.description)
        form.setValue("developer", game.developer)
        form.setValue("image", game.image)
        form.setValue("genres", game.genres)
        setIsEditing(true)
        editingGame.current = game
        setIsAddDialogVisible(true)
    }
    
    function onGameCreateClick() {
        setIsEditing(false)
        form.reset()
    }
    
    function onGameDelete(game: FavouriteGame) {
        removeGame.mutate(game.id)
    }
    
    function getApiUrl(): string {
        const payload = JSON.parse(atob(context.token.split(".")[1]))
        return `${location.protocol}//${location.host}/api/favourite/${payload.nameid}`
    }

    return (
        <div className="flex flex-col w-[700px] mx-auto py-8">
            <Dialog open={isAddDialogVisible} onOpenChange={setIsAddDialogVisible}>
                <DialogTrigger asChild>
                    <Button onClick={onGameCreateClick} className="ml-auto">Add game</Button>
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
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Genres</FormLabel>
                                        <FormControl>
                                            <Input autoComplete="off"
                                                   placeholder="Enter a genre by pressing enter or space"
                                                   value={genreText}
                                                   onChange={(e) => setGenreText(e.target.value)}
                                                   onKeyDown={onGenreInputKeyDown}/>
                                        </FormControl>
                                        <div className="flex flex-wrap gap-2">
                                            {form.watch("genres").map(genre => (
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
                                <Button className="mt-2" type="submit">{!isEditing ? "Create" : "Edit"}</Button>
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
                {queryGames.isLoading && <Loading />}
                {!queryGames.isLoading && queryGames.isSuccess && queryGames.data.map(game => (
                    <GameInfoCard 
                        key={game.id}
                        game={game}
                        onEditClick={onGameEditClick}
                        onDeleteClick={onGameDelete}
                    />
                ))}
            </div>
        </div>
    )
}

function GameInfoCard(
    props: {
        game: FavouriteGame,
        onEditClick: (game: FavouriteGame) => void,
        onDeleteClick: (game: FavouriteGame) => void
    }
) {
    const game = props.game
    const [isDropDownVisible, setIsDropDownVisible] = useState(false)
    
    function onEditClick() {
        setIsDropDownVisible(false)
        props.onEditClick(game)
    }
    
    return (
        <div className="flex flex-col gap-1 p-3 bg-gray-300 w-[300px] rounded-md shadow-md">
            <div className="w-full rounded-md h-64 overflow-hidden shadow-md">
                <img src={game.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between w-full items-center mt-2">
                <p className="font-bold text-xl">{game.title}</p>
                <DropdownMenu open={isDropDownVisible} onOpenChange={setIsDropDownVisible} >
                    <DropdownMenuTrigger>
                        <EllipsisVertical className="hover:cursor-pointer"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={onEditClick}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => props.onDeleteClick(game)} className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <p className="text-sm mb-4">{game.description}</p>
            <p>Genres: {game.genres.join(", ")}</p>
            <p>Developer: {game.developer}</p>
        </div>
    )
}

function useFavouriteGameQueries() {
    const client = useQueryClient()
    const context = useContext(AppContext)
    
    const createGame = useMutation({
        mutationFn: async (data: object) => {
            return await axios.post("/api/favourite", data, getAuthHeader(context.token))
        },
        onSettled: () => client.invalidateQueries({queryKey: favouriteGamesKey}),
    })
    
    const queryGames = useQuery<FavouriteGame[]>({
        queryKey: favouriteGamesKey,
        queryFn: async () => {
            return (await axios.get("/api/favourite", getAuthHeader(context.token))).data
        }
    })
    
    const updateGame = useMutation({
        mutationFn: async (data: Partial<FavouriteGame>) => {
            return await axios.put("/api/favourite", data, getAuthHeader(context.token))
        },
        onMutate: async (newGame: Partial<FavouriteGame>) => {
            await client.cancelQueries({ queryKey: favouriteGamesKey })
            const previousGames: FavouriteGame[] | undefined = client.getQueryData(favouriteGamesKey)
            client.setQueryData(favouriteGamesKey, previousGames?.map(game => {
                if (game.id !== newGame.id) return game
                return { ...game, ...newGame }
            }))
            return { previousGames }
        },
        onError: async (_, __, context) => {
            client.setQueryData(favouriteGamesKey, context?.previousGames)
        },
        onSettled: () => client.invalidateQueries({ queryKey: favouriteGamesKey })
    })
    
    const removeGame = useMutation({
        mutationFn: async (id: number) => {
            return await axios.delete(`/api/favourite/${id}`, getAuthHeader(context.token))
        },
        onMutate: async (id: number) => {
            await client.cancelQueries({queryKey: favouriteGamesKey})
            const previousGames: FavouriteGame[] | undefined = client.getQueryData(favouriteGamesKey)
            client.setQueryData(favouriteGamesKey, previousGames?.filter(game => game.id !== id))
            return { previousGames }
        },
        onError: async (_, __, context) => {
            client.setQueryData(favouriteGamesKey, context?.previousGames)
        },
        onSettled: () => client.invalidateQueries({ queryKey: favouriteGamesKey })
    })

    return { queryGames, updateGame, removeGame, createGame }
}