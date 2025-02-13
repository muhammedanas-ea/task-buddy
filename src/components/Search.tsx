import SearchNotFound from "../assets/images/SearchNotFound.png";

const Search = () => {
  return (
    <div className="h-[70vh] flex justify-center items-center">
      <div className="text-center flex flex-col items-center">
        <div className="h-60 w-80 flex items-center justify-center mb-4">
          <img
            className="w-full h-full object-cover"
            src={SearchNotFound}
            alt="SearchNotFound"
          />
        </div>
        <h1 className="text-xl text-[#2F2F2F] font-bold text-center">
          It looks like we can't find any results <br /> that match.
        </h1>
      </div>
    </div>
  );
};
export default Search;
