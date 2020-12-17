<script>
  import flatMap from "lodash/flatMap";
  export let collectives = [];
  export let searchResult = [];
  export let searchTerm = "";
  export let init = false;

  async function search() {
    if (collectives.length === 0) {
      await fetch("./collectives.json")
        .then((r) => r.json())
        .then((data) => {
          collectives = data;
        });
    }

    init = true;
    const keywords = searchTerm.split(",").map((s) => s.trim().toLowerCase());

    searchResult = flatMap(collectives, (collective) => {
      return collective.elements.map((element) => {
        return {
          issue: collective.issue,
          issueDate: collective.dateIssue,
          title: element.title,
          description: element.description,
          url: element.url,
        };
      });
    })
      .filter((element) => {
        return keywords.some(
          (keyword) =>
            element.title.toLowerCase().includes(keyword) ||
            element.description.toLowerCase().includes(keyword)
        );
      })
      .sort((a, b) => b.issue - a.issue);
  }

  const onKeyPress = (e) => {
    if (e.charCode === 13) search();
  };
</script>

<main class="container mx-auto">
  <div
    class="flex items-center w-full justify-center pb-6 pt-3 px-4 sm:px-6 lg:px-8">
    <div class="justify-center items-center space-y-3">
      <div>
        <h1 class="text-center text-3xl font-extrabold text-gray-900">
          Search through all
          <a
            href="https://tympanus.net/codrops/"
            class="text-blue-700 underline"
            target="_blank">Codrops</a>' Collectives
        </h1>
        <p class="text-sm text-gray-700 text-center pb-2">
          Made with ❤ by
          <a
            class="text-blue-700 underline"
            href="https://boix.dev"
            target="_blank">David de los Santos Boix</a>.
        </p>
      </div>
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="keyword" class="sr-only">Keyword(s)</label>
          <input
            bind:value={searchTerm}
            on:keypress={onKeyPress}
            id="keyword"
            name="keyword"
            type="text"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Comma Separated Keyword(s)" />
        </div>
      </div>

      <div>
        <button
          on:click={search}
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3" />
          Search!
        </button>
      </div>
    </div>
  </div>

  {#if init}
    {#if searchResult.length > 0}
      <p class="text-sm text-center text-gray-600">
        Found
        {searchResult.length}
        elements
      </p>
      <div class="flex flex-col my-2">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block sm:px-6 lg:px-8">
            <div
              class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="pl-2 py-3 text-left text-md font-medium text-gray-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th
                      scope="col"
                      class="pl-2 py-3 text-left text-md font-medium text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {#each searchResult as collective}
                    <tr class="hover:bg-gray-50">
                      <td class="py-4 whitespace-normal">
                        <div class="flex items-center">
                          <div class="ml-2">
                            <div class="text-md font-medium text-gray-900">
                              <a
                                href={collective.url}
                                class="text-blue-700 underline"
                                target="_blank">{@html collective.title}</a>
                              <p class="text-md text-gray-700 ml-2">
                                {collective.issueDate}, Issue
                                {collective.issue}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="pr-6 py-4 whitespace-normal">
                        <div class="text-md text-gray-900 ml-2">
                          {@html collective.description}
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center text-gray-700">
        <h2>Nothing could be found with given keyword(s) :(</h2>
      </div>
    {/if}
  {/if}
</main>
