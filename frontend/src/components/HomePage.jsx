const HomePage = () => {
  return (
    <div className="container w-full py-12 mx-auto md:py-24 lg:py-32">
      <section className="w-full mx-auto mb-32 text-center">
        <h1 className="text-5xl font-bold text-primary sm:text-4xl md:text-7xl">
          Connect. Collaborate. Resonate.
        </h1>
        <h2 className="mt-4 text-xl md:text-xl">
          Resonate is the place for audio professionals to keep <em>forever</em> clients.
        </h2>
      </section>

      <section className="w-full space-y-8">
        <h2 className="text-2xl">Build a project...</h2>
        <p>Build a project to manage your work and clients.</p>
        <hr />

        <h2 className="text-2xl">...Then add clients!</h2>
        <p>Connect with your clients and have them attached to your project.</p>

        <hr />


      </section>
    </div>
  );
};
export default HomePage;
