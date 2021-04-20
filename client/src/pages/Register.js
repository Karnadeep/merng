import React, { useContext, useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { AuthContext } from '../context/auth'

import { useForm } from '../util/hooks'
function Register(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [adduser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, { data: { register: userData } }) {
            context.login(userData)
            props.history.push('/')
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values

    })

    function registerUser() {
        adduser()
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Register</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    type="text"
                    error={errors.username ? true : false}
                    onChange={onChange}
                    value={values.username} />

                <Form.Input
                    label="Email"
                    placeholder="Email..."
                    name="email"
                    type="email"
                    error={errors.email ? true : false}
                    onChange={onChange}
                    value={values.email} />
                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    name="password"
                    type="password"
                    error={errors.password ? true : false}
                    onChange={onChange}
                    value={values.password} />
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password..."
                    name="confirmPassword"
                    type="password"
                    error={errors.confirmPassword ? true : false}
                    onChange={onChange}
                    value={values.confirmPassword} />
                <Button type="submit" primary>
                    Register
                </Button>
            </Form>
            {Object.keys(errors).length > 0 &&
                (
                    <div className="ui error message">
                        <ui className="list">
                            {Object.values(errors).map(value => (
                                <li key={value}>{value}</li>
                            ))}
                        </ui>
                    </div>
                )}
        </div>
    )
}
const REGISTER_USER = gql`
 mutation register(
     $username:String!
     $email:String!
     $password:String!
     $confirmPassword:String!
 ){
    register(
        registerInput:{
            username:$username
            email:$email
            password:$password
            confirmPassword:$confirmPassword
        }
    ){
        id email username createdAt token
    }
 }
`
export default Register
