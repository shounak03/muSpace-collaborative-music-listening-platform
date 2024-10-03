"use client"
import { CardWrapper } from "./card-wrapper"
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import * as z from "zod"
import { RegisterSchema } from "@/schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";

export const RegisterForm = () => {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            fullname: ""
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        login(values)
        //can user fetch action here too

    }

    return (


        <CardWrapper
            headerLabel="Create an Account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField control={form.control} name="fullname" render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                fullname
                            </FormLabel>
                            <FormControl>


                                <Input
                                    {...field}
                                    placeholder="enter your password"
                                    type="fullname"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <FormControl>


                                    <Input
                                        {...field}
                                        placeholder="enter your email"
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <FormControl>


                                    <Input
                                        {...field}
                                        placeholder="enter your password"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />


                    </div>
                    <FormError />
                    <FormSuccess />
                    <Button typeof="submit" className="w-full">
                        Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>

    );
};