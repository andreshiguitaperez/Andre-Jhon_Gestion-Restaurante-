import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '@/src/utils/gql/queries/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createUser } from '@/src/utils/api';
import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { nanoid } from 'nanoid';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().min(2, {
    message: 'email must be at least 2 characters.',
  }),
});

export async function getServerSideProps(context: { params: { id: string } }) {
  const id = context.params.id;
  return {
    props: { id },
  };
}

const Index = ({ id }: { id: string }) => {
  const [getUser] = useLazyQuery(GET_USER_BY_ID, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      console.log('user', data);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const passsword = nanoid();
    try {
      const usuario = await createUser({
        name: values.username,
        email: values.email,
        password: passsword,
      });
      console.log(usuario);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getUser({ variables: { userId: id } });
  }, [id]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Nombre' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='Nombre' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};

export default Index;
