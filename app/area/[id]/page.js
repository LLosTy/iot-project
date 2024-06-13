"use client"// app/area/[id]/page.js

import { useParams } from 'next/navigation';

const AreaPage = () => {
    const params = useParams();
    const { id } = params;

    return (
        <div>
            <h1>Area ID: {id}</h1>
        </div>
    );
};

export default AreaPage;
