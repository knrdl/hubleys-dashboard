<script>
    import Fa from "svelte-fa";
    import {
        faSearch
    } from '@fortawesome/free-solid-svg-icons'
</script>

<form method="get" target="_blank" rel="noopener noreferrer" action="https://search.example.org/search">
    <!--    todo-->
    <div class="flex relative">

        <select class="cursor-pointer pl-2 text-sm font-medium text-center text-gray-700 bg-gray-100/70 border border-gray-300 rounded-l-lg hover:bg-gray-200 border-r-0 focus:ring-2 focus:outline-none focus:ring-gray-100 dark:bg-gray-700/80 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600">
            <option value="whoogle" selected>Whoogle</option>
            <!--            todo-->
        </select>
        <div class="relative w-full">
            <input type="search" name="q" placeholder="Search" required list="browsers"
                   class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-100/70 hover:bg-gray-200 rounded-r-lg border border-gray-300 border-l-0 dark:bg-gray-700/75 dark:hover:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:outline-none focus:ring-gray-100 dark:focus:ring-gray-700"
            >
            <!--            todo-->
            <datalist id="browsers">
                <option value="Edge">
                <option value="Firefox">
                <option value="Chrome">
                <option value="Opera">
                <option value="Safari">
            </datalist>
            <button type="submit"
                    class="absolute top-0 right-0 h-full w-10 flex justify-center items-center text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100/70 rounded-r-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100 dark:dark:bg-gray-700/75 dark:hover:bg-gray-700 dark:focus:ring-blue-800">
                <Fa icon={faSearch}/>
            </button>
        </div>
    </div>
</form>

