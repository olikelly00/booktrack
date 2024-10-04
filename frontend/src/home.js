import { Fragment, useRef, useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'
import './home.css';
import { BarChart } from '@mui/x-charts/BarChart';

// import { set } from 'mongoose';


export default function HomePage() {
    
    const navigate = useNavigate();

    const [newMediaItemData, setNewMediaItemData] = useState({
        title: "",
        mediaType: "",
        mediaIcon: "",
        blurb: "",
        starRating: "",
        review: "",
    });

    const [search, setSearch] = useState("")
    const [isNewItemAdded, setIsNewItemAdded] = useState(false);
    const [mediaItems, setMediaItems] = useState([]); 
    const [filteredMedia, setFilteredMedia] = useState([]); 
    const [addNewItemClicked, setAddNewItemClicked] = useState(false);
    const [selectedMediaItem, setSelectedMediaItem] = useState(null);

    const [noResultsFound, setNoResultsFound] = useState(false);
    const [mediaItemModalVisible, setMediaItemModalVisible] = useState(false);

    const handleChange = async (e) => {
        setNewMediaItemData({ ...newMediaItemData, [e.target.name]: e.target.value });
        console.log(newMediaItemData);
    }


    const handleCloseModal = () => {
        console.log('closing modal');
        setMediaItemModalVisible(false);
        setAddNewItemClicked(false);
        console.log(mediaItemModalVisible)
        setSelectedMediaItem(null);    
        };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearch(value)
        if (value.trim() === '') {
            setFilteredMedia(mediaItems);
            setNoResultsFound(false);
          } else {
            const result = mediaItems.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
            setFilteredMedia(result);
            result.length === 0 ? setNoResultsFound(true) : setNoResultsFound(false);
          }
        };
      
        const handleOpenModal = (mediaItem) => {
            console.log('Opening modal for:', mediaItem);
            setSelectedMediaItem(mediaItem);
            setMediaItemModalVisible(true);
        };
        

    const handleSubmit = (event) => {
        event.preventDefault();
        const result = mediaItems.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
        setFilteredMedia(result)
        result.length === 0 ? setNoResultsFound(true) : setNoResultsFound(false)
        console.log(noResultsFound)
        try {
    } catch(error) {
        console.error('error filtering results', error)
    };
    };

   

    
    const handleDelete = async (mediaItemData) => {
        console.log('deleting item:', mediaItemData);
        try {
            const response = await fetch(`http://localhost:3001/media/${mediaItemData._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer invalids token`,
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Handle cases where the response is empty (204 No Content)
            if (response.status === 204) {
                console.log('Item successfully deleted from the backend');
            } else {
                // If there's a response body, parse it
                const data = await response.json();
                console.log('Success:', data);
            }
    
            // Remove the item from the state to update the UI
            setMediaItems((prevItems) => prevItems.filter(item => item._id !== mediaItemData._id));
            setFilteredMedia((prevItems) => prevItems.filter(item => item._id !== mediaItemData._id));
    
            // Close the modal after successful deletion
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    


    
    
    



    useEffect(() => {
        const fetchData = async () => {
            const jwt = localStorage.getItem('jwt');
            try {
                const response = await fetch(`http://localhost:3001/media`, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                });
                const mediaData = await response.json();
                const orderedData = orderMediaItems(mediaData);
                setMediaItems(orderedData);
                setFilteredMedia(orderedData);
                console.log(orderedData);
            } catch(error) {
                console.error('error fetching media items', error);
            }
        };
        fetchData();
    }, []);



   
useEffect(() => {
  if (isNewItemAdded) {
    const fetchData = async () => {
      const jwt = localStorage.getItem('jwt');
      try {
        const response = await fetch(`http://localhost:3001/media`, {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        });
        const mediaData = await response.json();
        setMediaItems(mediaData);
        setFilteredMedia(mediaData);
      } catch(error) {
        console.error('error fetching media items', error);
      }
    };
    fetchData();
    setIsNewItemAdded(false);
  }
}, [isNewItemAdded]);

function addNewItem() {
    setAddNewItemClicked(!addNewItemClicked);
}

async function handleLogOut() {
    //make an API call to add the token to the blacklist
    try {
      const response = await fetch('http://localhost:3001/addtokentoblacklist', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({
              token: localStorage.getItem('jwt')
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
  } catch (error) {
      console.error('Error:', error);
  }
  localStorage.removeItem('jwt');
  navigate('/login');
    
}

    return (
        <section className='media-section h-full bg-default-bg-color'>
        <div className="nav-bar">
          <div className = "w-screen h-24 overflow-hidden relative">
          <img src="/Pasted_Graphic.svg" className="w-screen opacity-50 absolute h-full w-full object-cover"></img>
          <div className="button-container">
          <button className="absolute right-10 top-8 z-10 button-container justify-center rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => handleLogOut()}>Log out</button>
          </div>
          </div>
          
        </div>
        <div className="hero-section bg-red">
          <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">exploreMe</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">Check out the latest insights from your reading, binge-watching and movie marathons here</p>
          <BarChart
  xAxis={[{ scaleType: 'band', data: ['Books', 'Film', 'TV'] }]}
  series={[{ data: [(filteredMedia.filter((mediaItem) => mediaItem.mediaType === 'book').length), (filteredMedia.filter((mediaItem) => mediaItem.mediaType === 'film')).length, (filteredMedia.filter((mediaItem) => mediaItem.mediaType === 'tv')).length] }]}
  width={500}
  height={300}
/>
        </div>

            {addNewItemClicked && (
  <AddMediaItemModal 
    setMediaItemModalVisible={setMediaItemModalVisible}
    setSelectedMediaItem={setSelectedMediaItem}
    handleOpenModal={handleOpenModal} 
    newMediaItemData={newMediaItemData}     
    handleChange={handleChange}             
    setIsNewItemAdded={setIsNewItemAdded}   
    addNewItem={addNewItem}     
    handleDelete={handleDelete}  
    handleCloseModal={handleCloseModal}          
  />
)}

<div className="options-container">
  <form className="searchForm" onSubmit={handleSubmit}> 
            <label>
                <input 
                className="searchBar button-container justify-center rounded-md border  py-2 px-4 text-sm font-medium shadow-sm focus:outline-none "
                type="text" 
                name="search" 
                value={search} 
                onChange={(event) => handleSearch(event)}
                    />
            </label>
            
              <button className="submit-button button-container justify-center rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" type="submit">Search</button>
            </form>
            <button className="addNewItem-button button-container justify-center rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={addNewItem}>Add new item</button>
            <button className="adviseMe-button button-container justify-center rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => navigate('/adviseme')}>adviseMe</button>
            </div>
            <div className="noResultsMessage">
            {noResultsFound && <p>No results found. Please try again.</p>}
            </div>
            <div className='media-container'>
            {orderMediaItems(filteredMedia).map((item) => (
    <MediaThumbnail 
        key={item._id} 
        mediaItem={item} 
        handleOpenModal={handleOpenModal} 
    />
))}
    {mediaItemModalVisible && (
                <MediaItemModal 
                    setMediaItemModalVisible={setMediaItemModalVisible}
                    mediaItem={selectedMediaItem}
                    handleCloseModal={handleCloseModal} // Pass handleClose to the modal
                    handleDelete={handleDelete}

                />
            )}
</div>
        </section>  
        )
};

export function orderMediaItems(mediaItems) {
    return [...mediaItems].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
}

export function MediaThumbnail({ mediaItem, handleOpenModal }) {

    const { title, mediaType, mediaIcon } = mediaItem;

    const mediaTypeBgColors = {
        film: 'bg-film-bg-color',
        tv: 'bg-tv-bg-color',
        book: 'bg-book-bg-color',
        theater: 'bg-theater-bg-color', 
      };

      const mediaTypeIcons = {
        film:  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(255, 255, 255, 0.6)" className="size-12">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
        </svg>,
        book: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(255, 255, 255, 0.6)" className="size-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>,
        tv: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(255, 255, 255, 0.6)" className="size-12">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      }

      const bgColorClass = mediaTypeBgColors[mediaType.toLowerCase()]

    return (
        <button className={`media-thumbnail ${bgColorClass}`} onClick={() => handleOpenModal(mediaItem)}>
            {mediaTypeIcons[mediaType.toLowerCase()]}
            <p>{mediaIcon}</p>
            <p>{title}</p>
        </button>
        
    )
}

    
    async function createMedia(newMediaItemData) {
        console.log(newMediaItemData)
        try {
            const response = await fetch('http://localhost:3001/media', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    title: newMediaItemData.title,
                    mediaType: newMediaItemData.mediaType,
                    blurb: newMediaItemData.blurb,
                    starRating: newMediaItemData.starRating,
                    review: newMediaItemData.review,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    }



    export function AddNewItem({ newMediaItemData, 
        handleChange, 
        setIsNewItemAdded, 
        addNewItem, 
        setMediaItemModalVisible,
    handleCloseModal}) {
    


        return (
              <div className="mt-8 h-screen color-default-bg-color">              
      
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md h-screen color-bg-color">

                    <div className="bg-red py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={ async (event) => {
                        event.preventDefault();
                        await createMedia(newMediaItemData);
                        setIsNewItemAdded(true);
                        handleCloseModal();

                        }} method="POST">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Title
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={newMediaItemData.title}
                                        onChange={handleChange}
                                        autoComplete="title"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="creator"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Creator
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="creator"
                                        name="creator"
                                        type="creator"
                                        value={newMediaItemData.author}
                                        onChange={handleChange}
                                        autoComplete="creator"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <label
                                    htmlFor="mediaType"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Type of Media
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="mediaType"
                                        name="mediaType"
                                        type="mediaType"
                                        value={newMediaItemData.mediaType}
                                        onChange={handleChange}
                                        autoComplete="mediaType"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <label
                                    htmlFor="mediaType"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Mini-blurb - what's it about?
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="blurb"
                                        name="blurb"
                                        type="blurb"
                                        value={newMediaItemData.blurb}
                                        onChange={handleChange}
                                        autoComplete="blurb"
                                        
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <label
                                    htmlFor="starRating"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Star rating
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="starRating"
                                        name="starRating"
                                        type="starRating"
                                        value={newMediaItemData.starRating}
                                        onChange={handleChange}
                                        autoComplete="starRating"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <label
                                    htmlFor="starRating"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Mini-review - what did you think?
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="review"
                                        name="review"
                                        type="review"
                                        value={newMediaItemData.review}
                                        onChange={handleChange}
                                        autoComplete="review"
                                        
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Add item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }


   

export function MediaItemModal({setMediaItemModalVisible, handleOpenModal, mediaItem, handleDelete, handleCloseModal}) {
  const [open, setOpen] = useState(true)

  const cancelButtonRef = useRef(null)



  
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="mediaDetailsContainer">
                    <h1>{mediaItem.title}</h1>
                    <p>{mediaItem.mediaType}</p>
                    <p>{mediaItem.starRating}</p>
                    <p>{mediaItem.review}</p>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={handleCloseModal}
                  >
                    Back
                  </button>
                  <button
  type="button"
  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
  onClick={() => handleDelete(mediaItem)}
  ref={cancelButtonRef}
>
  Delete
</button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={handleCloseModal}
                    ref={cancelButtonRef}
                  >
                    Edit
                  </button>
                </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}


export function AddMediaItemModal({
    setMediaItemModalVisible, 
    setSelectedMediaItem,
    handleOpenModal, 
    newMediaItemData, 
    handleChange, 
    setIsNewItemAdded, 
    addNewItem,
handleCloseModal}) {
    const [open, setOpen] = useState(true)
  
    const cancelButtonRef = useRef(null)
  
   
    
  
    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
  
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <AddNewItem 
    newMediaItemData={newMediaItemData} 
  handleChange={handleChange} 
  setIsNewItemAdded={setIsNewItemAdded}
  addNewItem={addNewItem} 
  setMediaItemModalVisible={setMediaItemModalVisible}
  handleCloseModal={handleCloseModal}
/>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }