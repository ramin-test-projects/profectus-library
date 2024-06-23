using AutoMapper;

namespace LibraryWebApis;

public class ControllerHelpers
{
    private readonly IMapper _mapper;
    private readonly CurrentUser _currentUser;
    private readonly AppSettings _appSettings;

    public ControllerHelpers(IMapper mapper, CurrentUser currentUser, AppSettings appSettings)
    {
        _mapper = mapper;
        _currentUser = currentUser;
        _appSettings = appSettings;
    }

    public IMapper Mapper
    {
        get { return _mapper; }
    }

    public CurrentUser CurrentUser
    {
        get { return _currentUser; }
    }

    public AppSettings AppSettings
    {
        get { return _appSettings; }
    }
}
