import React from 'react';
import { Loader as MantineLoader, Center, Text } from '@mantine/core';

const Loader = () => {
    return (
        <Center className="h-screen bg-black text-white">
            <div className="flex flex-col items-center">
                <MantineLoader color="white" size="xl" />
                <Text className="mt-4 text-white">Loading...</Text>
            </div>
        </Center>
    );
};

export default Loader;
