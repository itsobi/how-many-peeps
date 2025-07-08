import { PageHeading } from '@/components/page-heading';
import { HomeView } from '@/components/views/home-view';

export default function HomePage() {
  return (
    <>
      <PageHeading
        title="Home"
        description="Welcome, take a look around at the live number of patrons at numerous venues."
        bottomMargin
      />
      <HomeView />
    </>
  );
}
