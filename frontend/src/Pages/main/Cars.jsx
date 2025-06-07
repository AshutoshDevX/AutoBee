import React from 'react'
import { useParams } from 'react-router'

export const Cars = () => {
    const { id } = useParams();
    const a = 23434;

    return (
        <div>
            {id}
        </div>
    )
}
