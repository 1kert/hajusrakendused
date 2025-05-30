import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import {Button} from "../../components/ui/button.tsx";

const formSchema = z.object({
    firstName: z
        .string()
        .nonempty("First name is required")
        .max(50, "Can't be longer than 50 characters"),
    lastName: z
        .string()
        .nonempty("Last name is required")
        .max(50, "Can't be longer than 50 characters"),
    email: z
        .string()
        .nonempty("Email is required")
        .max(50, "Can't be longer than 50 characters")
        .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Not a valid email address format"),
    phone: z
        .string()
        .nonempty("Phone number is required")
        .regex(/^[+]?[(]?[0-9]{3}[)]?[- .]?[0-9]{3}[- .]?[0-9]{4,6}$/, "Not a valid phone number format")
})

type formSchemaType = z.infer<typeof formSchema>

export default function StoreContinueFormScreen() {
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: ""
        }
    })
    
    function onSubmit(data: formSchemaType) {
        console.log(JSON.stringify(data));
    }
    
    return (
        <div className="w-[600px] flex flex-col mx-auto py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField 
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email address</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone number</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    
                    <Button type="submit" className="mt-4">Continue to checkout</Button>
                </form>
            </Form>
        </div>
    )
}