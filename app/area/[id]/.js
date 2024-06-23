// pages/area/[id].js
import { useRouter } from 'next/router';
import AreaPage from '/app/area/[id]/page';

const AreaPageWrapper = () => {
    const router = useRouter();
    const { id } = router.query;

    return <AreaPage id={id} />;
};

export default AreaPageWrapper;
