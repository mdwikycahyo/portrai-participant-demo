"use client";

export function PlatformContent() {
  return (
    <div
      className="flex-1 overflow-y-auto bg-white platform-scroll-area"
      style={{ maxHeight: "calc(100vh - 200px)" }}
    >
      <div className="max-w-5xl mx-auto px-12 py-16">
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center leading-tight">
            Welcome to PortrAI
          </h1>

          {/* Home Section */}
          <section id="home-section" className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
              Home Section
            </h2>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                Lorem ipsum dolor sit amet consectetur. Id pharetra
                aliquam ornare et amet sed eget velit ipsum. Duis
                mauris lectus eget morbi aliquam. At sed amet
                phasellus etiam tortor risus diam vehicula. Eget uma
                elementum integer cras. Urna a tellus mauris sit purus
                sit dignissim tincidunt vulputate at pharetra. Mauris
                fusce sed vecro pat pellentesque habitant imperdiet
                sodales arcu. Proin tristique at odio lacinia at orci
                mauris nibh. Quis sed facilisis magna elit feugiat
                lobortis consequat fermentum. Faucibus egestas magna
                arcu et. Amet sapien lorem est luctus donec donec amet
                integer.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Risus arcu ut ipsum lectus non dictum. Risus dolor
                egestas turpis vel leo purus. At in nibh mi enim et
                faucibus id faucibus. Tristique ut eget tellus
                feugiat. Turpis mauris commodo vivamus libero gravida
                amet volutpat donec sit. Lobortis convallis risus
                pellentesque et lorem vitae scelerisque. Erat quis
                iaculis pretium sodales sit sit nisl ullamcorper. Leo
                bibendum risus sagittis nibh vivamus nam nisl
                consectetur. Laoreet parturient quam nunc, pretium
                sapien morbi et leo. Eget urna habitasse sagittis leo
                et dolor. Nullam rhoncus urna volutpat sit amet
                interdum. Lobortis neque pellentesque feugiat purus.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Risus lorem sed turpis et nibh dignissim mauris
                vulputate. Montes at rhoncus est nisl vel et vitae
                bibendum tincidunt. Elementum purus elementum sit nibh
                blandit diam morbi ultrices. Augue consectetur ut
                facilisis scelerisque id commodo vel eu. Vitae mauris
                tristique viverra sapien sagittis. Euismod aliquet
                euismod placerat cum scelerisque.
              </p>
            </div>

            {/* Video Placeholder */}
            <div className="bg-gray-100 rounded-2xl p-16 flex flex-col items-center justify-center mt-12">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="material-icons text-gray-600 text-4xl">
                  play_arrow
                </span>
              </div>
            </div>
          </section>

          {/* Chat Section */}
          <section id="chat-section" className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
              Chat
            </h2>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                Risus arcu ut ipsum lectus non dictum. Risus dolor
                egestas turpis vel leo purus. At in nibh mi enim et
                faucibus id faucibus. Tristique ut eget tellus
                feugiat. Turpis mauris commodo vivamus libero gravida
                amet volutpat donec sit.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Lobortis convallis risus pellentesque et lorem vitae
                scelerisque. Erat quis iaculis pretium sodales sit sit
                nisl ullamcorper. Leo bibendum risus sagittis nibh
                vivamus nam nisl consectetur.
              </p>
            </div>
          </section>

          {/* Email Section */}
          <section id="email-section" className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
              Email
            </h2>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                Laoreet parturient quam nunc, pretium sapien morbi et
                leo. Eget urna habitasse sagittis leo et dolor. Nullam
                rhoncus urna volutpat sit amet interdum. Lobortis
                neque pellentesque feugiat purus.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Risus lorem sed turpis et nibh dignissim mauris
                vulputate. Montes at rhoncus est nisl vel et vitae
                bibendum tincidunt. Elementum purus elementum sit nibh
                blandit diam morbi ultrices.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Augue consectetur ut facilisis scelerisque id commodo
                vel eu. Vitae mauris tristique viverra sapien
                sagittis. Euismod aliquet euismod placerat cum
                scelerisque.
              </p>
            </div>
          </section>

          {/* Documents Section */}
          <section id="documents-section" className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
              Documents
            </h2>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                Lorem ipsum dolor sit amet consectetur. Id pharetra
                aliquam ornare et amet sed eget velit ipsum. Duis
                mauris lectus eget morbi aliquam. At sed amet
                phasellus etiam tortor risus diam vehicula. Eget uma
                elementum integer cras. Urna a tellus mauris sit purus
                sit dignissim tincidunt vulputate at pharetra.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Mauris fusce sed vecro pat pellentesque habitant
                imperdiet sodales arcu. Proin tristique at odio
                lacinia at orci mauris nibh. Quis sed facilisis magna
                elit feugiat lobortis consequat fermentum. Faucibus
                egestas magna arcu et. Amet sapien lorem est luctus
                donec donec amet integer.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}