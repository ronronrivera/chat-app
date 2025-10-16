import {useState, useRef} from 'react';
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const mouseClickSound = new Audio("/sounds/frontend_public_sounds_mouse-click.mp3")
mouseClickSound.volume = 0.2;

const ProfileHeader = () => {

  const {logout, authUser, updateProfile} = useAuthStore();
  const {isSoundEnabled, toggleSound} = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) =>{
    const file = e.target.files[0];
    if(!file) return;
    
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () =>{
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      await updateProfile({profilePic: base64Image})
    }

  }

  return (
    <div className="p-6 border-b border-slate-700/50 ">
      <div className='flex items-center justify-between '>
        <div className="flex items-center gap-3">
          <div className='avatar online'>

            {/* AVATAR */}
            <button className='size-14 rounded-full overflow-hidden relative group' onClick={ () => fileInputRef.current.click() }>
              <img src={selectedImg || authUser.profilePic || "/avatar.png"} alt='user image' className='size-full object-cover'/>
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                <span className='text-white text-xs'>Change</span>
              </div>
            </button> 
            <div>
              <input type="file"
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
              />

            </div>
          </div>
            {/* USERNAME & ONLINE TEXT */}
            <div>
                <h3 className='text-slate-200 font-medium text-base max-w-[180px] truncate '>
                  {authUser.fullname}
                </h3>
                <p className="text-slate-400 text-xsm">Online</p>
            </div>
        </div>
        {/* BUTTONS */}
        <div className='flex gap-4 items-center'>
            {/*LOGOUT BUTTON*/}
          <button className='text-slate-400 hover:text-slate-200 transition-colors' 
            onClick={logout}>
              <LogOutIcon className='size-5'/> 
            </button>
          {/* SOUND TOGGLE BTN */}

          <button className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              //play click sound before toggling
              mouseClickSound.currentTime = 0; //reset to restart
              mouseClickSound.play().catch((error)=> console.log("Audio play failed: ", error));
              toggleSound();
            }}
          >
            {isSoundEnabled? (<Volume2Icon className='size-5'/>) : (<VolumeOffIcon className='size-5'/>) }
          </button>

        </div>
      </div>
    </div>
  )
}

export default ProfileHeader 
