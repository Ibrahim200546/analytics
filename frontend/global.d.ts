namespace NextJS {
    type SFC<T> = (T) => (React.ReactNode | Promise<React.ReactNode>);
}
